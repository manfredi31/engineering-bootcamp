from .piece import Piece

class Rook(Piece):

    def valid_moves(self, board):
        return self.sliding_moves(board,[(1, 0), (-1, 0), (0, 1), (0, -1)])
