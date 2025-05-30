"""Created Doctor, Patient, Slot and Appointment table

Revision ID: 2bd54caa9eac
Revises: be84fc30f3bf
Create Date: 2025-05-15 21:27:34.399936

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2bd54caa9eac'
down_revision = 'be84fc30f3bf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('doctor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=256), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('doctor', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_doctor_email'), ['email'], unique=True)

    op.create_table('patient',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=256), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('patient', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_patient_email'), ['email'], unique=True)

    op.create_table('slot',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('start_time', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('slot', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_slot_doctor_id'), ['doctor_id'], unique=False)

    op.create_table('appointment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=False),
    sa.Column('slot_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['patient_id'], ['patient.id'], ),
    sa.ForeignKeyConstraint(['slot_id'], ['slot.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('appointment', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_appointment_patient_id'), ['patient_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_appointment_slot_id'), ['slot_id'], unique=True)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index('ix_user_email')

    op.drop_table('user')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=False),
    sa.Column('password_hash', sa.VARCHAR(length=256), autoincrement=False, nullable=True),
    sa.Column('role', sa.VARCHAR(length=20), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='user_pkey')
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.create_index('ix_user_email', ['email'], unique=True)

    with op.batch_alter_table('appointment', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_appointment_slot_id'))
        batch_op.drop_index(batch_op.f('ix_appointment_patient_id'))

    op.drop_table('appointment')
    with op.batch_alter_table('slot', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_slot_doctor_id'))

    op.drop_table('slot')
    with op.batch_alter_table('patient', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_patient_email'))

    op.drop_table('patient')
    with op.batch_alter_table('doctor', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_doctor_email'))

    op.drop_table('doctor')
    # ### end Alembic commands ###
