import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config( { path: '.env' } )

const dbPuestos = new Sequelize(process.env.DB_NOMBRE_PUESTOS, process.env.DB_USER_PUESTOS, process.env.DB_PASS_PUESTOS,{
    host: process.env.DB_HOST_PUESTOS,
    port: 1433,
    dialect: 'mssql',
    dialectOptions: {
        options: {
          requestTimeout: 300000
        }
      },
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
})

export default dbPuestos