import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faInfo,
  faExclamationTriangle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const ToastContent = ({ type, message }) => {
  const contentConfig = [
    {
      type: "SUCCESS",
      iconInfo: faCheckCircle,
      classNames: "bg-green-extra-light color-text-green-success",
    },
    {
      type: "ERROR",
      iconInfo: faExclamationTriangle,
      classNames: "bg-red-light color-text-green-success",
    },
    {
      type: "WARN",
      iconInfo: faExclamationCircle,
      classNames: "bg-warn-extra-light color-text-green-success",
    },
    {
      type: "INFO",
      iconInfo: faInfo,
      classNames: "bg-info-extra-light color-text-green-success",
    },
  ];

  const contentObj = findContentType(type)[0];

  function findContentType(type) {
    return contentConfig.filter((item) => {
      return item.type === type;
    });
  }

  return (
    <div className={contentObj.classNames}>
      <span className="p-10">
        <FontAwesomeIcon
          className="icon-size"
          icon={contentObj.iconInfo}
        ></FontAwesomeIcon>
      </span>
      <div className="inline-block">{message}</div>
    </div>
  );
};

export { ToastContent };
