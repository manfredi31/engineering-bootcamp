
board = [
    [" ", " ", " "], 
    [" ", " ", " "], 
    [" ", " ", " "]
    ]

def check_win():
    if (
    (board[0][0] == board[0][1] and board[0][1] == board[0][2] and board[0][0] != " ") or 
    (board[1][0] == board[1][1] and board[1][1] == board[1][2] and board[1][0] != " ") or 
    (board[2][0] == board[2][1] and board[2][1] == board[2][2] and board[2][0] != " ") or 
    (board[0][0] == board[1][0] and board[1][0] == board[2][0] and board[0][0] != " ") or 
    (board[0][1] == board[1][1] and board[1][1] == board[2][1] and board[0][1] != " ") or 
    (board[0][2] == board[1][2] and board[1][2] == board[2][2] and board[0][2] != " ") or 
    (board[0][0] == board[1][1] and board[1][1] == board[2][2] and board[0][0] != " ") or 
    (board[0][2] == board[1][1] and board[1][1] == board[2][0] and board[0][2] != " ")
):
        return True
    else:
        return False

def make_move(playername, playersign):
    playerloc = input(f"{playername}, where do you want to put the {playersign}? ")
    playerloclist = playerloc.split(",")
    board[int(playerloclist[0])][int(playerloclist[1])] = playersign
    for row in board:
        print(row)

for row in board:
        print(row)
player1sign = ""
player2sign = ""
x = 0

while x == 0:
    if player1sign == "":
        player1sign = input("Player 1, what do you want to do? X or O?: " )
    else:
        pass
    make_move("Player 1", player1sign)
    if check_win():
        print(f"Game has ended. Player1 won")
        x = 1
        break

    if player1sign == "X":
        player2sign = "O" 
    else:
        player2sign = "X" 
    make_move("Player 2", player2sign)
        if check_win():
        print(f"Game has ended. Player2 won")
        x = 1
        break
  

