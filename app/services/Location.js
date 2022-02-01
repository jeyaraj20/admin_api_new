"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Country = mongoose.model("tbl__country");
const State = mongoose.model("tbl__state");
const City = mongoose.model("tbl__city");

// db.State.belongsTo(db.Country, {
//     targetKey: "country_id",
//     foreignKey: "country_id",
// });
// db.City.belongsTo(db.State, { targetKey: "state_id", foreignKey: "state_id" });
module.exports = {
    // 1.  Get All Active Country By Status
    getAllCountry: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  rows  = await Country.find({
                 country_status: status 
            }).sort({ country_name: 1 });
            if (!rows) {
                return jsend(404,"Country Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, country: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Country By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2. Get All Active State By Status
    getAllState: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  rows  = await State.find({
                state_status: status ,
                include: [{ model: Country }],
            }).sort({ state_name: 1 });
            if (!rows) {
                return jsend(404,"State Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, state: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active State By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 3. Get All Active City By Status
    getAllCity: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  rows  = await City.find({
                city_status: status ,
                include: [{ model: State }],
            }).sort({ city_name: 1 });
            if (!rows) {
                return jsend(404,"City Not Found !!!");
            }else{
           const count = rows.length;
           return jsend(200, "data received Successfully",
           { count, city: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active City By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4. CreateState
    createState: async (req, res, next) => {
        try {
            const { country_id, state_name, country_code } = req.payload;
        const message =  await State.create({
                country_id,
                state_name,
                country_code,
                state_status: "Y",
                lastdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            })
              
                .catch((err) => {
                    return jsend(500,err.message);
                });       if(message){
                    return jsend(200, "data received Successfully",
                    { message })
                }else{
                    return jsend(500,"Please try again after sometime");
                }
        } catch (error) {
            logger.error(`Error at Create State : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 5. UpdateState
    updateState: async (req, res, next) => {
        try {
            const { stateId } = req.params;
            const { country_id, state_name, country_code } = req.payload;

        const result =  await State.findOneAndUpdate({ state_id: stateId } ,
                {
                    country_id,
                    state_name,
                    country_code,
                    state_status: "Y",
                    lastdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                } )
               
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Update Success !!!" })
                   }else{
                    return jsend(500, "Please try again after sometime" )
                   }
        } catch (error) {
            logger.error(`Error at Update State : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 6.UpdateStateStatus
    updateStateStatus: async (req, res, next) => {
        try {
            const { stateId, status } = req.payload;
            if (!stateId || !status)  return jsend(400, "Please send valid request data");
             const result =  await State.findOneAndUpdate(
                        { state_status: status },
                        { state_id: stateId },
                    );
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Update Success !!!" })
                   }else{
                    return jsend(500, "Please try again after sometime" )
                   }
        } catch (error) {
            logger.error(`Error at Update State Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 7. CreateCity
    createCity: async (req, res, next) => {
        try {
            const { state_id, city_name, city_code } = req.payload;
        const createCity =   await City.create({
                state_id,
                city_name,
                city_code,
                city_status: "Y",
                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            })
                .catch((err) => {
                    return jsend(404,err.message);
                });
                if(createCity){
                    return jsend(200, "data received Successfully", 
                    { message: "Insert Success",createCity });
                }else{
                    return jsend(500, "Please try again after sometime")
                }
        } catch (error) {
            logger.error(`Error at Create City : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 8.UpdateCity
    updateCity: async (req, res, next) => {
        try {
            const { cityId } = req.params;
            const { state_id, city_name, city_code } = req.payload;

        const result =   await City.findOneAndUpdate(  {  city_id: cityId  },
                {
                    state_id,
                    city_name,
                    city_code,
                    state_status: "Y",
                    lastdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                }
              
            )
                .catch((err) => {
                    return jsend(404,err.message);
                });
                if(result){
                    return jsend(200, "data received Successfully", 
                    { message: "Insert Success",result });
                }else{
                    return jsend(500, "Please try again after sometime")
                }
        } catch (error) {
            logger.error(`Error at Update City : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 9. UpdateCityStatus
    updateCityStatus: async (req, res, next) => {
        try {
            const { cityId, status } = req.payload;
            if (!cityId || !status)return jsend(400, "Please send valid request data");
          
              const result =  await City.findOneAndUpdate(
                        { city_status: status },
                         { city_id: cityId  },
                    ).catch((err) => {
                        return jsend(500,err.message);
                    });
               if(result){
                return jsend(200, "data received Successfully",
                { message: "Update Success !!!" })
               }else{
                return jsend(500, "Please try again after sometime" )
               }   
        } catch (error) {
            logger.error(`Error at Update City Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 10. GetStateByName
    getStateByName: async (req, res, next) => {
        try {
            const { statename } = req.params;
            const state = await State.findOne({
               state_name: statename 
            });
            if (!state) {
                return jsend(400, "State Not Found !!!");
            }else{
           return jsend(200,
               {  state: state });
            }
        } catch (error) {
            logger.error(`Error at Get State By Name : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    //  11.Get All Active City By Status
    getCityByName: async (req, res, next) => {
        try {
            const { cityname } = req.params;
            const city = await City.findOne({
                 city_name: cityname 
            });
            if (!city) {
                jsend(404,"City Not Found !!!");
            }else{
            return jsend(200, "data received Successfully",{ city: city });
            }
        } catch (error) {
            logger.error(`Error at Get All Active City By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 12.  Get State Count Only
    getStateCount: async (req, res, next) => {
        try {
            const { state_status } = req.params;
            if (state_status == null)  return jsend(400, "Please send valid request data");
            let count = 0;
            count = await State.count({
                 state_status:state_status ,
            }).catch((err) => {
                return jsend(500, error.message);
            });
          return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get State Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 13. Get City Count Only
    getCityCount: async (req, res, next) => {
        try {
            let { city_status } = req.params;
            if (city_status == null)  return jsend(400, "Please send valid request data");
            let count = 0;
            count = await City.count({
                 city_status 
            }).catch((err) => {
                return jsend(500, error.message);
            });
          return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get City Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    }
};
