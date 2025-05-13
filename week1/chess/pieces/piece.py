class Piece():

    def __init__(self, color, location):
        self._color = color # "white" or "black"
        self._location = location # (6,4 )
    
    def move_to (self, new_location, board):
        if new_location in self.valid_moves(board):
            target = board[new_location[0]][new_location[1]]
            if target is not None and target._color != self._color:
                print(f"{type(target).__name__} captured!")
                GameState.capture_piece(target)  #  removes the piece from game state
            board[self._location[0]][self._location[1]] = None
            board[new_location[0]][new_location[1]] = self
            self._location = new_location
        else: 
            print("❌ Invalid move")

    def valid_moves(self, board):
        raise NotImplementedError("Define in subclass")

    def sliding_moves(self, board, directions):
        moves = []
        row, col = self._location
        for dx, dy in directions:
            x, y = row, col
            while True:
                x += dx
                y += dy
                if not (0 <= x < 8 and 0 <= y < 8):
                    break

                target = board[x][y]
                if target is None:
                    moves.append((x, y))
                elif target._color != self._color:
                    moves.append((x, y))
                    break
                else:
                    break
        return moves
