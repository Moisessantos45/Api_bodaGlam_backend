interface Post {
  id: string;
  tipo: string;
  imagen: string;
  descripcion: string;
  titulo: string;
  author: string;
  fecha: string;
  idUser: string;
}

interface User {
  id: string;
  nameUser: string;
  email: string;
  password: string;
  avatar: string;
  token: string;
  clave: string;
}

export { Post,User };
