import { Response , Request } from "express"
import { ILogoutDto } from "./user.dto"
import { createLoginCredentials, logoutEnum ,createRvokeToken } from "../../utils/security/token.security"
import { UpdateQuery  } from "mongoose"
import { HUserDecument, IUser, UserModel } from "../../DB/model/user.model"
import { UserRepository } from "../../DB/repository/user.repository"
import { TokenRepository } from "../../DB/repository/token.repository"
import { TokenModel } from "../../DB/model/Token.model"
import { JwtPayload } from "jsonwebtoken"

class UserService {
    private userModel = new UserRepository(UserModel)
     private tokenModel = new TokenRepository(TokenModel)
    constructor(){}


profile = async (req :Request, res : Response):Promise<Response> => {
  
    return res.json({
        message:"Done",
        data:{
            user: req.user?._id,
            decoded:req.decoded?.iat
        },
    })
}

logout = async (req :Request, res : Response):Promise<Response> => {
  const {flag} : ILogoutDto= req.body
  const update : UpdateQuery<IUser>={};  
let statusCode : number = 200;
  switch (flag) {
    case logoutEnum.all:
        update.changeCredentialsTime = new Date()
        break;
    default:
     await createRvokeToken(req.decoded as JwtPayload)
        statusCode=201
        break;
  }
  await this.userModel.updateOne({
    filter: {_id:req.decoded?._id},
    update
  })
  return res.status(statusCode).json({
        message:"Done",
       
    })
}


refreshToken =async (req :Request, res : Response):Promise<Response> => {
  const credentials = await createLoginCredentials(req.user as HUserDecument)
await createRvokeToken(req.decoded as JwtPayload)
  return res.status(201).json({message : "Done" , data :{credentials}})
}

}

export default new UserService()