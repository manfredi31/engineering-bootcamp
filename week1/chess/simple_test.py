from pieces import King, Queen, Rook
from game import GameState, is_king_in_check, is_checkmate

# Reset GameState
GameState.white_active = []
GameState.black_active = []

def print_simple_board(board):
    print("  " + " ".join(str(i) for i in range(8)))
    for i, row in enumerate(board):
        print(str(i) + " " + " ".join(type(p).__name__[0] if p else "." for p in row))

def setup_empty_board():
    return [[None for _ in range(8)] for _ in range(8)]

# Test a check scenario
board = setup_empty_board()

# Place white king
white_king = King("white", (7, 4))
board[7][4] = white_king
GameState.add_piece(white_king)

# Place black queen threatening the king
black_queen = Queen("black", (5, 4))
board[5][4] = black_queen
GameState.add_piece(black_queen)

print("\n=== CHECK SCENARIO ===")
print_simple_board(board)
check_result = is_king_in_check("white", board)
print(f"Is white king in check? {check_result}")
checkmate_result = is_checkmate("white", board)
print(f"Is white king in checkmate? {checkmate_result}")

# Test a checkmate scenario
board2 = setup_empty_board()
white_king = King("white", (7, 7))
board2[7][7] = white_king
GameState.add_piece(white_king)

# Rooks on same row and column
black_rook1 = Rook("black", (7, 0))  # Rook on same row as king
board2[7][0] = black_rook1
GameState.add_piece(black_rook1)

black_rook2 = Rook("black", (0, 7))  # Rook on same column as king
board2[0][7] = black_rook2
GameState.add_piece(black_rook2)

# Queen blocking the diagonal escape
black_queen = Queen("black", (6, 6))  # Blocks diagonal escape
board2[6][6] = black_queen
GameState.add_piece(black_queen)

print("\n=== CHECKMATE SCENARIO ===")
print_simple_board(board2)
check_result = is_king_in_check("white", board2)
print(f"Is white king in check? {check_result}")
checkmate_result = is_checkmate("white", board2)
print(f"Is white king in checkmate? {checkmate_result}") 