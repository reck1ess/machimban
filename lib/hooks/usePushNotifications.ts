import axios from "axios";
import React from "react";

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription,
} from "../utils/pushNotification";

const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser

const usePushNotifications = () => {
  const [userConsent, setSuserConsent] = React.useState(
    Notification.permission
  );
  const [userSubscription, setUserSubscription] = React.useState(null);
  const [
    pushServerSubscriptionId,
    setPushServerSubscriptionId,
  ] = React.useState();
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);

  const onClickAskUserPermission = () => {
    setLoading(true);
    setError(false);
    askUserPermission().then((consent) => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "푸시 권한 획득 실패",
          message: "푸시 알림 관련 권한을 허용하지 않으셨습니다.",
          code: 0,
        });
      }
      setLoading(false);
    });
  };
  //

  const onClickSusbribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    createNotificationSubscription()
      .then((subscrition) => {
        setUserSubscription(subscrition);
        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "Couldn't create the notification subscription",
          err,
          "name:",
          err.name,
          "message:",
          err.message,
          "code:",
          err.code
        );
        setError(err);
        setLoading(false);
      });
  };

  const onClickSendSubscriptionToPushServer = () => {
    setLoading(true);
    setError(false);
    axios
      .post("/subscription", userSubscription)
      .then((response: any) => {
        setPushServerSubscriptionId(response.data.id);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const onClickSendNotification = () => {
    setLoading(true);
    setError(false);
    axios
      .get(`/subscription/${pushServerSubscriptionId}`)
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading,
  };
};

export default usePushNotifications;
