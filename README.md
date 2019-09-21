# Pathfinding algorithm Visualizer

Generates an interactive visualization of the algorithm.

![Alt Text](https://media.giphy.com/media/Q8fjyPnOqQrwSmeju4/giphy.gif)

## Features

##### 1. Visualisations of the algorithms

- **Dijkstra's Algorithm** (weighted): the father of pathfinding algorithms; guarantees the shortest path
- **A Search\*** (weighted): arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm
- **Greedy Best-first Search** (weighted): a faster, more heuristic-heavy version of A\*; does not guarantee the shortest path
- **Swarm Algorithm** (weighted): a mixture of Dijkstra's Algorithm and A\*; does not guarantee the shortest-path
- **Convergent Swarm Algorithm** (weighted): the faster, more heuristic-heavy version of Swarm; does not guarantee the shortest path
- **Bidirectional Swarm Algorithm** (weighted): Swarm from both sides; does not guarantee the shortest path
- **Breath-first Search** (unweighted): a great algorithm; guarantees the shortest path
- **Depth-first Search** (unweighted): a very bad algorithm for pathfinding; does not guarantee the shortest path

##### 2. Mazes and patterns

Create sample mazes with walls and weights:

- Recursive Division
- Recursive Division (vertical skew)
- Recursive Division (horizontal skew)
- Basic Random Maze
- Basic Weight Maze
- Simple Stair Pattern

##### 3. Adjust the path drawing speed

The app allows to adjust the speed to draw the path with 3 levels: _fast_, _average_ and _slow_.

## Development

### Build and run

Install Angular CLI:

```sh
$ yarn global add @angular/cli
```

Install node modules:

```sh
$ yarn install
```

Run the app

```sh
$ yarn start
```

To build production:

```sh
$ yarn run build
```

### Testing

##### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

##### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

**Thanks**
