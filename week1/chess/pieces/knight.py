from .piece import Piece

class Knight(Piece):

    def __init__(self, color, location):
        super().__init__(color, location)
        self._movement_vectors = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]

    def valid_moves(self, board):
        moves = []
        for dx, dy in self._movement_vectors:
            x = self._location[0] + dx
            y = self._location[1] + dy

            if 0 <= x < 8 and 0 <= y < 8:  
                target = board[y][x]

                if target is None:
                    moves.append((x, y))
                elif target._color != self._color:
                    moves.append((x, y))
        return moves
