from pieces import Rook
from pieces import Bishop
from pieces import King
from pieces import Knight
from pieces import Pawn
from pieces import Queen
from pieces import Piece
from game import GameState, is_king_in_check, is_checkmate

# Class lookup table

piece_classes = {
    "Rook": Rook,
    "Knight": Knight,
    "Bishop": Bishop,
    "Queen": Queen,
    "King": King,
    "Pawn": Pawn
}

# Starting piece positions

white_pieces = {
    "Rook": [(7, 0), (7, 7)],
    "Knight": [(7, 1), (7, 6)],
    "Bishop": [(7, 2), (7, 5)],
    "Queen": [(7, 3)],
    "King": [(7, 4)],
    "Pawn": [(6, i) for i in range(8)]
}

black_pieces = {
    "Rook": [(0, 0), (0, 7)],
    "Knight": [(0, 1), (0, 6)],
    "Bishop": [(0, 2), (0, 5)],
    "Queen": [(0, 3)],
    "King": [(0, 4)],
    "Pawn": [(1, i) for i in range(8)]
}

# Setup 

def setup_pieces(piece_dict, color, board):
    for piece_name, positions in piece_dict.items():
        piece_class = piece_classes[piece_name]
        for pos in positions:
            piece = piece_class(color, pos)
            board[pos[0]][pos[1]] = piece
            GameState.add_piece(piece)

def print_board(board):
    print("  " + " ".join(str(i) for i in range(8)))  # column labels
    for i, row in enumerate(board):
        print(str(i) + " " + " ".join(type(p).__name__[0] if p else "." for p in row))


def get_player_move(color):
    from_row, from_col, to_row, to_col = map(int, input(f"{color.capitalize()}'s move (format: from_row, from_col, to_row, to_col): ").split(", "))
    piece = board[from_row][from_col]
    if piece and piece._color == color:
        piece.move_to((to_row, to_col), board)
    else:
        print("❌ Invalid piece selection")

board = [[None for _ in range(8)] for _ in range(8)]
setup_pieces(white_pieces, "white", board)
setup_pieces(black_pieces, "black", board)
turn = "white"

while True:
    print_board(board)

    if is_checkmate(turn, board):
        print(f"Checkmate! {turn.capitalize()} loses.")
        break
    
    if is_king_in_check(turn, board):
        print(f"{turn.capitalize()} is in check")


    get_player_move(player_color)
    turn = "black" if turn == "white" else "white"