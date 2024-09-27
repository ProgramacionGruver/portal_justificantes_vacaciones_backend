import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import Usuarios from './Usuarios.js'

const IncapacidadesNominas = db.define('incapacidades_nominas', {
    idIncapacidadNomina: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numero_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
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
    nombreSucursal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numeroSeguroSocial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    folio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ramoSeguro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipoIncapacidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    riesgoTrabajo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diasIncapacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fechaApartir: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechaTermino: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechaExpedido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipoRiesgo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    urlDocumento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estatusSua: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    estatusContpaq: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    st7: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    st2: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    siaat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    urlDocumentoSt7: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    urlDocumentoSt2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    urlDocumentoSiaat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    editedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descuentoDiasEconomicos: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    numeroDiasEconomicos: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},
    {
        sequelize,
        modelName: "incapacidades_nominas",
    })


Usuarios.hasMany(IncapacidadesNominas, { foreignKey: 'numero_empleado', sourceKey: 'numero_empleado' })
IncapacidadesNominas.belongsTo(Usuarios, { foreignKey: 'numero_empleado', targetKey: 'numero_empleado'})

export default IncapacidadesNominas