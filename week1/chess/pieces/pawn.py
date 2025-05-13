from .piece import Piece

class Pawn(Piece):

    def valid_moves(self, board):
        moves = []
        row, col = self._location  # unpack position

        # Step 1: set direction based on color
        direction = -1 if self._color == "white" else 1

        # Step 2: check one step forward
        one_forward = (row + direction, col)
        if 0 <= one_forward[0] < 8 and board[one_forward[0]][one_forward[1]] is None:
            moves.append(one_forward)

            # Step 3: check two steps forward (only on first move)
            is_first_move = (
                row == 6 if self._color == "white" else row == 1
            )
            if is_first_move:
                two_forward = (row + 2 * direction, col)
                if board[two_forward[0]][two_forward[1]] is None:
                    moves.append(two_forward)

        # Step 4: check diagonal captures
        for dy in [-1, 1]:  # left and right diagonals
            diag = (row + direction, col + dy)
            if 0 <= diag[0] < 8 and 0 <= diag[1] < 8:
                target = board[diag[0]][diag[1]]
                if target is not None and target._color != self._color:
                    moves.append(diag)

        return moves