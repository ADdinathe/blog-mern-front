import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axious from "../../axious";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axious.post("/auth/login", params);

  return data;
});

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axious.get("/auth/me");

  return data;
});

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axious.post("/auth/register", params);

    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

//TODO: тут можно сократить но я пока хз как
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.data = null;
      state.status = "loafing";
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuth.rejected]: (state, action) => {
      state.data = null;
      state.status = "error";
    },

    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loafing";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.rejected]: (state, action) => {
      state.data = null;
      state.status = "error";
    },

    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = "loafing";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchRegister.rejected]: (state, action) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const selectIsAuth = (state) => !!state.auth.data;

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
