import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import Usuarios from './Usuarios.js'

const DiasGanados = db.define('dias_ganados', {
    idDiasGanados: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombreEmpleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    claveEmpresa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    claveSucursal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    claveDepartamento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diasGanados: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descripcionMotivo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    editedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        sequelize,
        modelName: "dias_ganados",
    })


Usuarios.hasMany(DiasGanados, { foreignKey: 'numero_empleado', sourceKey: 'numero_empleado' })
DiasGanados.belongsTo(Usuarios, { foreignKey: 'numero_empleado', targetKey: 'numero_empleado'})

export default DiasGanados