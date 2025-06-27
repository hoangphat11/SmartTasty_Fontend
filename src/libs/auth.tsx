// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";

// interface Props {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }

// interface JwtPayload {
//   role: string;
//   exp: number;
// }

// const RoleProtectedLayout = ({ children, allowedRoles }: Props) => {
//   const router = useRouter();
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("token="))
//       ?.split("=")[1];

//     if (!token) {
//       router.replace("/login");
//       return;
//     }

//     try {
//       const decoded = jwtDecode<JwtPayload>(token);
//       if (!allowedRoles.includes(decoded.role)) {
//         router.replace("/unauthorized");
//         return;
//       }

//       setAuthorized(true);
//     } catch {
//       router.replace("/login");
//     }
//   }, []);

//   if (!authorized) return null; // hoặc loading...

//   return <>{children}</>;
// };

// export default RoleProtectedLayout;
