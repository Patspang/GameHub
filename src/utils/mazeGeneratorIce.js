// Procedural ice maze generator using DFS recursive backtracker
// Produces a 2D grid: 1 = wall (ice), 0 = path (snow)
// Also handles penguin spawn, sea exit, and fish placement

const DIRECTIONS = [
  { dr: -1, dc: 0 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
];

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate maze via DFS recursive backtracker
// cellRows x cellCols cells → (2*cellRows+1) x (2*cellCols+1) maze grid
export function generateIceMaze(cellRows, cellCols, extraWallsToRemove = 0) {
  const rows = 2 * cellRows + 1;
  const cols = 2 * cellCols + 1;

  // Initialize all walls
  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Track visited cells
  const visited = Array.from({ length: cellRows }, () => Array(cellCols).fill(false));

  // Start DFS from top-left cell
  const stack = [{ r: 0, c: 0 }];
  visited[0][0] = true;
  maze[1][1] = 0;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    // Find unvisited neighbors
    const unvisited = DIRECTIONS.filter(({ dr, dc }) => {
      const nr = current.r + dr;
      const nc = current.c + dc;
      return nr >= 0 && nr < cellRows && nc >= 0 && nc < cellCols && !visited[nr][nc];
    });

    if (unvisited.length > 0) {
      // Pick random neighbor
      const { dr, dc } = unvisited[Math.floor(Math.random() * unvisited.length)];
      const nr = current.r + dr;
      const nc = current.c + dc;

      // Carve wall between current and neighbor
      maze[current.r + nr + 1][current.c + nc + 1] = 0;
      // Open neighbor cell
      maze[2 * nr + 1][2 * nc + 1] = 0;

      visited[nr][nc] = true;
      stack.push({ r: nr, c: nc });
    } else {
      stack.pop();
    }
  }

  // Widen corridors by removing extra interior walls adjacent to paths
  if (extraWallsToRemove > 0) {
    const interiorWalls = [];
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (maze[r][c] === 1) {
          const adjPath = DIRECTIONS.some(({ dr, dc }) => {
            const ar = r + dr;
            const ac = c + dc;
            return ar >= 0 && ar < rows && ac >= 0 && ac < cols && maze[ar][ac] === 0;
          });
          if (adjPath) interiorWalls.push({ r, c });
        }
      }
    }
    const shuffled = shuffle(interiorWalls);
    const count = Math.min(extraWallsToRemove, shuffled.length);
    for (let i = 0; i < count; i++) {
      maze[shuffled[i].r][shuffled[i].c] = 0;
    }
  }

  return { maze, rows, cols };
}

// Penguin starts at top-left open cell
export function getPenguinSpawn() {
  // Cell (0,0) is at maze position (1,1)
  return { row: 1, col: 1 };
}

// Sea exit at bottom-right, carve boundary opening
export function getSeaExit(maze, rows, cols) {
  // Find the open cell closest to bottom-right corner
  // The bottom-right DFS cell is at maze position (rows-2, cols-2)
  const exitRow = rows - 2;
  // Carve an opening on the right boundary so the exit is visible
  maze[exitRow][cols - 1] = 0;

  return { row: exitRow, col: cols - 1 };
}

// BFS from a position, returns distance map
function bfs(maze, startRow, startCol, rows, cols) {
  const dist = Array.from({ length: rows }, () => Array(cols).fill(-1));
  dist[startRow][startCol] = 0;
  const queue = [{ r: startRow, c: startCol }];
  let head = 0;

  while (head < queue.length) {
    const { r, c } = queue[head++];
    for (const { dr, dc } of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] === 0 && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push({ r: nr, c: nc });
      }
    }
  }

  return dist;
}

// Place numbered fish at positions spread along the path from spawn to exit
export function placeFish(maze, count, spawn, seaExit, rows, cols) {
  const dist = bfs(maze, spawn.row, spawn.col, rows, cols);

  // Collect all open positions with their distances (exclude spawn and sea exit area)
  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && dist[r][c] > 0) {
        // Exclude spawn position and sea exit
        const isSpawn = r === spawn.row && c === spawn.col;
        const isExit = r === seaExit.row && c === seaExit.col;
        if (!isSpawn && !isExit && dist[r][c] >= 3) {
          positions.push({ row: r, col: c, dist: dist[r][c] });
        }
      }
    }
  }

  // Sort by distance from spawn
  positions.sort((a, b) => a.dist - b.dist);

  // Divide into N buckets (skip the first bucket so fish aren't right at spawn)
  const bucketSize = Math.floor(positions.length / (count + 1));
  const fish = [];

  for (let i = 0; i < count; i++) {
    const bucketStart = (i + 1) * bucketSize;
    const bucketEnd = Math.min(bucketStart + bucketSize, positions.length);
    const bucket = positions.slice(bucketStart, bucketEnd);

    if (bucket.length > 0) {
      const pick = bucket[Math.floor(Math.random() * bucket.length)];
      fish.push({
        id: i,
        number: i + 1,
        row: pick.row,
        col: pick.col,
        collected: false,
      });
    }
  }

  // Fallback: if we couldn't place enough fish, fill from remaining positions
  if (fish.length < count) {
    const usedPositions = new Set(fish.map((f) => `${f.row},${f.col}`));
    const remaining = shuffle(positions.filter((p) => !usedPositions.has(`${p.row},${p.col}`)));
    for (let i = fish.length; i < count && remaining.length > 0; i++) {
      const pick = remaining.pop();
      fish.push({
        id: i,
        number: i + 1,
        row: pick.row,
        col: pick.col,
        collected: false,
      });
    }
  }

  return fish;
}
