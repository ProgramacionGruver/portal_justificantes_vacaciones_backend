import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const Usuarios = db.define('usuarios', {
    idUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_empleado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fechaAlta: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    aniosLaborados: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diasVacacionesLey: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diasVacacionesRestantes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diasEconomicosLey: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diasEconomicosRestantes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    puesto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    division: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    centroTrabajo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    siglasCentroTrabajo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numeroEmpleadoJefe: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    estatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    
},
{
    sequelize,
    modelName: "usuarios",
})

export default Usuarios