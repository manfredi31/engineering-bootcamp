from .piece import Piece

class Bishop(Piece):
    def valid_moves(self, board):
        return self.sliding_moves(board, [(1, 1), (-1, -1), (1, -1), (-1, 1)])