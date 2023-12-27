import logger  from "pino";


const level = 'info';

const log = logger({
    transport:{
        target: 'pino-pretty'
    },
    level,
    options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
    },
    base: {
        pid: false,
    },
    production:true,
    test:false,
    // timestamp: () => `,"time":"${dayjs().format()}"`
    

});



export default log;