/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

export const GTMContext = createContext(null);

export function GTMProvider({ children }) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
  }

  const pushEvent = (event) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push(event);
      console.log("GTM Event:", event);
    }
  };

  const trackLogin = (method) =>
    pushEvent({ event: "login", loginMethod: method });

  const trackPostCreation = (postId, tags) =>
    pushEvent({ event: "post_created", postId, postTags: tags });

  const trackAppointmentScheduled = (especialidade, profissionalId) =>
    pushEvent({
      event: "appointment_scheduled",
      especialidade,
      profissionalId,
    });

  return (
    <GTMContext.Provider
      value={{ pushEvent, trackLogin, trackPostCreation, trackAppointmentScheduled }}
    >
      {children}
    </GTMContext.Provider>
  );
}

export function useGTM() {
  return useContext(GTMContext);
}
