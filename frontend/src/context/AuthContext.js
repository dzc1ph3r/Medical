var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me as apiMe } from "../api/auth.api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loadingMe, setLoadingMe] = useState(true);
    const setToken = (t) => {
        setTokenState(t);
        if (t)
            localStorage.setItem("token", t);
        else
            localStorage.removeItem("token");
    };
    const logout = () => {
        setToken(null);
        setUser(null);
        setLoadingMe(false);
    };
    const refreshMe = () => __awaiter(this, void 0, void 0, function* () {
        if (!token) {
            setUser(null);
            setLoadingMe(false);
            return;
        }
        setLoadingMe(true);
        try {
            const res = yield apiMe(token);
            setUser(res.data);
        }
        catch (e) {
            // token invalide/expiré => on clean
            setToken(null);
            setUser(null);
        }
        finally {
            setLoadingMe(false);
        }
    });
    useEffect(() => {
        refreshMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
    const value = useMemo(() => ({ token, user, loadingMe, setToken, refreshMe, logout }), [token, user, loadingMe]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
