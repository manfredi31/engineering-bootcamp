from pieces import Rook
from pieces import Bishop
from pieces import King
from pieces import Knight
from pieces import Pawn
from pieces import Queen
from pieces import Piece
from copy import deepcopy

class GameState:
    white_active = []
    black_active = []

    @classmethod
    def add_piece(cls, piece):
        if piece._color == "white":
            cls.white_active.append(piece)
        else:
            cls.black_active.append(piece)

    @classmethod
    def capture_piece(cls, piece):
        if piece._color == "white":
            cls.white_active.remove(piece)
        else:
            cls.black_active.remove(piece)

def is_king_in_check(color, board):
    king_pos = None
    

    # This function should:
    # 1. Find the king's location for `color`
    # 2. Get all opponent's valid capture moves
    # 3. Return True if king's location is in that set

    # Opponent's pieces
    opponent_active_pieces = GameState.black_active if color == "white" else GameState.white_active

    # Find the king
    for row in board:
        for piece in row:
            if piece and isinstance(piece, King) and piece._color == color:
                king_pos = piece._location
                break #breaks out of inner loop
        
        if king_pos:
            break #breaks out of outer loop

    if not king_pos:
        print("King not found on the board")
        return True # Assume check (even if it should never happen)


    # Check if any opponent piece can capture king

    for piece in opponent_active_pieces:
        if king_pos in piece.valid_moves(board):
            return True
    return False

def is_checkmate(color, board):

# Checkmate = check + no escape moves

# Possible escape moves:
# - move the king to safe square
# - place a piece between attacker and king (possible for sliding pieces)
# - capture attacking piece

    if not is_king_in_check(color, board):
        return False

    opponent_active_pieces = GameState.black_active if color == "white" else GameState.white_active
    for piece in opponent_active_pieces:
        for move in piece.valid_moves(board):
            # Simulate the move on a copy of the board
            board_copy = deepcopy(board)
            piece_copy = board_copy[piece._location[0]][piece._location[1]]
            board_copy[move[0]][move[1]] = piece_copy
            board_copy[piece_copy._location[0]][piece_copy._location[1]] = None
            piece_copy._location = move
            if not is_king_in_check(color, board_copy):
                return False

    return True
