const developmentEnvironmentVariables = {
    local_apiUrl: 'http://localhost:3001',
    apiUrl: 'https://backend-yqwt.onrender.com',
}
const getEnvironments = (env) => {
    switch (env) {
        case 'dev':
            return developmentEnvironmentVariables;
        default:
            return developmentEnvironmentVariables;
    }
}

export const environments = getEnvironments('dev');
