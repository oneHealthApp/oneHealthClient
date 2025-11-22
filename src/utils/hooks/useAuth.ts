import {
  apiFetchMenusByRole,
  apiSignIn,
  apiSignOut,
  apiSignUp,
} from "@/services/AuthService";
import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
  setNavigationConfig,
} from "@/store";
import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import type { SignInCredential, SignUpCredential } from "@/@types/auth";
import { mapBackendMenusToNavigation } from "./useMenuMapper";

type Status = "success" | "failed";

function useAuth() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { accessToken, signedIn } = useAppSelector(
    (state) => state.auth.session
  );

  const fetchRoleMenus = async (roleId: string) => {
    try {
      const resp = await apiFetchMenusByRole(roleId);
      if (resp.success && resp.data) {
        const mappedMenus = mapBackendMenusToNavigation(
          resp.data.filter((m) => m.childOf === null)
        );
        console.log("mapp", mappedMenus);
        dispatch(setNavigationConfig(mappedMenus));
        console.log("user",user)
      }
    } catch (err) {
      console.error("Failed to fetch menus:", err);
    }
  };

  //   const signIn = async (
  //     values: SignInCredential
  //   ): Promise<
  //     | {
  //         status: Status;
  //         message: string;
  //       }
  //     | undefined
  //   > => {
  //     try {
  //       const resp = await apiSignIn(values);
  //       if (resp.data && resp.data.success) {
  //         const { accessToken, refreshToken, expiresIn, user } = resp.data.data;
  //         dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }));
  //         if (user) {
  //           // Map roles to authority for backward compatibility
  //           const authority = user.roles?.map((role) => role.roleName) || [];
  //           dispatch(
  //             setUser({
  //               id: user.id,
  //               username: user.username,
  //               emailId: user.emailId,
  //               fullName: user.username, // Use username as fullName since it's not in response
  //               roleId: user.roles.map((r: any) => r.roleId),
  //               roleName: user.roles.map((r: any) => r.roleName),
  //               roleCategory: user.roles.map((r: any) => r.roleCategory),
  //               authority: authority,
  //               avatar: "", // Default empty avatar
  //             })
  //           );
  //           const roleId = user.roles[0]?.roleId || "";
  //           if (roleId) {
  //             await fetchRoleMenus(roleId);
  //           }
  //         }
  //         const redirectUrl = query.get(REDIRECT_URL_KEY);
  //         navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
  //         return {
  //           status: "success",
  //           message: "",
  //         };
  //       }
  //       // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //     } catch (errors: any) {
  //       return {
  //         status: "failed",
  //         message: errors?.response?.data?.message || errors.toString(),
  //       };
  //     }
  //   };

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status;
        message: string;
      }
    | undefined
  > => {
    try {
      const resp = await apiSignIn(values);
      console.log("resp", resp);
      if (resp?.success) {
        const { user, accessToken, refreshToken, expiresIn } = resp.data;

        dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }));

        if (user) {
          const roles = user.roles || [];
          const authority = roles.map((r) => r.roleName);

          dispatch(
            setUser({
              id: user.id,
              username: user.username,
              emailId: user.emailId,
              fullName: user.username,
              roleId: roles.map((r) => r.roleId),
              roleName: roles.map((r) => r.roleName),
              roleCategory: roles.map((r) => r.roleCategory),
              authority,
              avatar: "",
            })
          );

          const roleId = roles[0]?.roleId || "";

          // Important: Handle fetchRoleMenus failure safely
          if (roleId) {
            try {
              await fetchRoleMenus(roleId);
            } catch (e) {
              console.warn("Menu fetch failed:", e);
            }
          }
        }

        // ---------- FIXED NAVIGATION ----------
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        const finalUrl = redirectUrl || appConfig.authenticatedEntryPath;

        console.log("Redirecting to:", finalUrl);

        // Delay to ensure redux finished updating
        setTimeout(() => {
          navigate(finalUrl);
        }, 50);

        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values);
      if (resp.data && resp.data.success) {
        const { accessToken, refreshToken, expiresIn, user } = resp.data.data;
        dispatch(signInSuccess({ accessToken, refreshToken, expiresIn }));
        if (user) {
          const authority = user.roles?.map((role) => role.roleName) || [];
          dispatch(
            setUser({
              id: user.id,
              username: user.username,
              emailId: user.emailId,
              fullName: user.username, // Use username as fullName since it's not in response
              roles: user.roles,
              authority: authority,
              avatar: "",
            })
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    dispatch(
      setUser({
        avatar: "",
        username: "",
        emailId: "",
        fullName: "",
        roles: [],
        authority: [],
      })
    );
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    await apiSignOut();
    handleSignOut();
  };

  return {
    authenticated: accessToken && signedIn,
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
