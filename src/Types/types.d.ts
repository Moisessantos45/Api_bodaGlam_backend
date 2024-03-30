interface Post {
  id: string;
  tipo: string;
  imagen: string;
  descripcion: string;
  titulo: string;
  author: string;
  fecha: string;
  idUser: string;
  status: boolean;
}

interface User {
  id: string;
  nameUser: string;
  email: string;
  password: string;
  avatar: string;
  token: string;
  clave: string;
  active:boolean
}

interface TypesJwt {
  id: string;
  iat: number;
  exp: number;
}


export { Post,User,TypesJwt };
