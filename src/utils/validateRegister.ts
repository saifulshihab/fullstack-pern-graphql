import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length < 3) {
    return [
      {
        field: "username",
        message: "Username must be 3 character!",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email (require @)!",
      },
    ];
  }
  if (options.password.length < 3) {
    return [
      {
        field: "password",
        message: "Password must be 3 character!",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Can not have @ in username!",
      },
    ];
  }

  return null;
};
