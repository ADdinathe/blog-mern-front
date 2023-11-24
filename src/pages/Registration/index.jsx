import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuth,
  fetchRegister,
  selectIsAuth,
} from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import axios from "../../axious";
// 5Мб
export const PHOTO_MAX_SIZE = 5242880;

function createFormData(data) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  //TODO: прикрутить ошибки валидации как на бэке
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Вася Пупкин",
      email: "sunOfaBeach@gmail.com",
      password: "digiridigiri",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      //TODO: надо как-то придумать отправлять картинку во время отправки формы регистрации
      const formData = createFormData({ avatar: image });

      const { data } = await axios.post("/upload/avatar", formData);

      setImageUrl(`http://localhost:4444${data.url}`);

      const response = await dispatch(
        fetchRegister({
          ...values,
          avatarUrl: `http://localhost:4444${data.url}`,
        })
      );

      if (!response.payload) {
        console.log("не удалось зарегистрироваться");
      }

      if ("token" in response.payload) {
        window.localStorage.setItem("token", response.payload.token);
      }
    } catch (err) {
      console.log("Ошибка при завторизации", err);
    }
  };

  const [imageUrl, setImageUrl] = React.useState("");
  const [image, setImage] = React.useState(null);
  const inputFileRef = React.useRef(null);
  const setCustomPhoto = (value) => {
    console.log("value", value);
    if (value) {
      setImage(value);
      setImageUrl(URL.createObjectURL(value));
      console.log(imageUrl);
    }
  };

  //TODO: надо грузить картинку только когда сохраняешь статью а не это говно
  const handleChangeFile = async (event) => {
    if (event.target.files) {
      if (event.target.files[0].size >= PHOTO_MAX_SIZE) {
        alert("tooBigFile");
      } else if (event.target.files[0].type.split("/")[0] !== "image") {
        alert("wrongFormat");
      } else {
        console.log(event.target.files[0]);
        setCustomPhoto(event.target.files[0]);
      }
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={imageUrl}
          onClick={() => inputFileRef.current.click()}
        />
        <input
          type="file"
          ref={inputFileRef}
          onChange={handleChangeFile}
          hidden
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          error={!!errors.fullName?.message}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Укажите полное имя" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          {...register("email", { required: "Укажите почту" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
