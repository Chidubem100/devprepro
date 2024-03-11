function isRefreshTokenExpired(payload:any): boolean{
    const currentTime = Math.floor(Date.now() / 1000)
    const expirationTime = payload.exp;

    return expirationTime < currentTime;
}


export default isRefreshTokenExpired;