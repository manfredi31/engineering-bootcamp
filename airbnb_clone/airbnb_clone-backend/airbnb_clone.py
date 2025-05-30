from app import create_app
from app.models import User, Account, Listing, Reservation
import sqlalchemy as sa
import sqlalchemy.orm as so

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)


