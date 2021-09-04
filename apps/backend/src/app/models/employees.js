import { Model, DataTypes } from 'sequelize';

export default class Employee extends Model {}

export function init(db) {
  Employee.init(
    {
      firstName: {
        field: 'first_name',
        type: DataTypes.TEXT,
      },
      lastName: {
        field: 'last_name',
        type: DataTypes.TEXT,
      },
      email: {
        field: 'email',
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'employees',
      sequelize: db,
    }
  );
}
