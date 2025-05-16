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
            if piece and piece.__class__.__name__ == "King" and piece._color == color:
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
    # First check if the king is in check
    if not is_king_in_check(color, board):
        return False
    
    # Find the king
    king_pos = None
    for r in range(8):
        for c in range(8):
            piece = board[r][c]
            if piece and piece.__class__.__name__ == "King" and piece._color == color:
                king_pos = (r, c)
                break
        if king_pos:
            break
            
    # Get the king piece
    king = board[king_pos[0]][king_pos[1]]
    
    # Check if king can move to safety
    for move in king.valid_moves(board):
        # Save the current state
        current_pos = king._location
        target_pos = move
        target_piece = board[target_pos[0]][target_pos[1]]
        
        # Try the move
        board[target_pos[0]][target_pos[1]] = king
        board[current_pos[0]][current_pos[1]] = None
        king._location = target_pos
        
        # Check if still in check
        still_in_check = is_king_in_check(color, board)
        
        # Undo the move
        king._location = current_pos
        board[current_pos[0]][current_pos[1]] = king
        board[target_pos[0]][target_pos[1]] = target_piece
        
        # If this move escapes check, not checkmate
        if not still_in_check:
            return False
    
    # Get other pieces of the same color
    player_pieces = []
    for r in range(8):
        for c in range(8):
            piece = board[r][c]
            if piece and piece._color == color and piece.__class__.__name__ != "King":
                player_pieces.append(piece)
    
    # Check if any other piece can block or capture to get out of check
    for piece in player_pieces:
        for move in piece.valid_moves(board):
            # Save the current state
            current_pos = piece._location
            target_pos = move
            target_piece = board[target_pos[0]][target_pos[1]]
            
            # Try the move
            board[target_pos[0]][target_pos[1]] = piece
            board[current_pos[0]][current_pos[1]] = None
            piece._location = target_pos
            
            # Check if still in check
            still_in_check = is_king_in_check(color, board)
            
            # Undo the move
            piece._location = current_pos
            board[current_pos[0]][current_pos[1]] = piece
            board[target_pos[0]][target_pos[1]] = target_piece
            
            # If this move escapes check, not checkmate
            if not still_in_check:
                return False
    
    # If no moves escape check, it's checkmate
    return True
