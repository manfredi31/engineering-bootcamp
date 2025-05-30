from . import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional
from datetime import datetime, timedelta, time
import calendar
import enum
from flask import request

class User(db.Model):
    __tablename__ = 'users'

    id: so.Mapped[str] = so.mapped_column(sa.String, primary_key=True)
    email: so.Mapped[Optional[str]] = so.mapped_column(sa.String(120), unique=True, nullable=True)
    name: so.Mapped[Optional[str]] = so.mapped_column(sa.String(80), nullable=True)
    emailVerified: so.Mapped[Optional[datetime]] = so.mapped_column(sa.DateTime, nullable=True)
    image: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    createdAt: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)
    updatedAt: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)
    favoriteIds: so.Mapped[Optional[list[str]]] = so.mapped_column(sa.JSON, nullable=True)

    accounts: so.Mapped[list["Account"]] = so.relationship(back_populates="user")
    listings: so.Mapped[list["Listing"]] = so.relationship(back_populates="user")
    reservations: so.Mapped[list["Reservation"]] = so.relationship(back_populates="user")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password: str) -> bool:
        if self.password_hash is None:
            return False
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.name or self.id}>'

class Account(db.Model):
    __tablename__ = 'accounts'

    id: so.Mapped[str] = so.mapped_column(sa.String, primary_key=True)
    userId: so.Mapped[str] = so.mapped_column(sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    type: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    provider: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    providerAccountId: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    refresh_token: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    access_token: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    expires_at: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer, nullable=True)
    token_type: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    scope: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    id_token: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)
    session_state: so.Mapped[Optional[str]] = so.mapped_column(sa.String, nullable=True)

    # Relationship with User, with cascade delete
    user: so.Mapped["User"] = so.relationship(back_populates="accounts")

    def __repr__(self):
        return f'<Account {self.provider}:{self.providerAccountId}>'

class Listing(db.Model):
    __tablename__ = 'listings'

    id: so.Mapped[str] = so.mapped_column(sa.String, primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    description: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    imageSrc: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    createdAt: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)
    category: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    roomCount: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    bathroomCount: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    guestCount: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    locationValue: so.Mapped[str] = so.mapped_column(sa.String, nullable=False)
    price: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    
    # User relationship
    userId: so.Mapped[str] = so.mapped_column(sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user: so.Mapped["User"] = so.relationship(back_populates="listings")

    # Reservations relationship
    reservations: so.Mapped[list["Reservation"]] = so.relationship(back_populates="listing", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Listing {self.title}>'

class Reservation(db.Model):
    __tablename__ = 'reservations'

    id: so.Mapped[str] = so.mapped_column(sa.String, primary_key=True)
    startDate: so.Mapped[datetime] = so.mapped_column(sa.DateTime, nullable=False)
    endDate: so.Mapped[datetime] = so.mapped_column(sa.DateTime, nullable=False)
    totalPrice: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    createdAt: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)

    # User relationship
    userId: so.Mapped[str] = so.mapped_column(sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user: so.Mapped["User"] = so.relationship(back_populates="reservations")

    # Listing relationship
    listingId: so.Mapped[str] = so.mapped_column(sa.ForeignKey('listings.id', ondelete='CASCADE'), nullable=False)
    listing: so.Mapped["Listing"] = so.relationship(back_populates="reservations")

    def __repr__(self):
        return f'<Reservation {self.id} ({self.startDate} - {self.endDate})>'
