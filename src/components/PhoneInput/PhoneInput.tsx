"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./phoneInput.module.css";
import clsx from "clsx";
import ArrowLottieAnimation from "./ArrowLottieAnimation";
import { ColorField, KeyTextField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import animation from "./animation.json";
import circleLoader from "./circleLoader.json";

type PhoneInputProps = {
  webhook_url: string;
  cta_text_color: ColorField;
  cta_background_color: ColorField;
  cta_text: KeyTextField;
  cta_placeholder_text?: KeyTextField;
  cta_error_message?: KeyTextField;
  on_submit_redirect_url?: any;
};

const PhoneInput = ({
  webhook_url,
  cta_text_color,
  cta_background_color,
  cta_text = "Do It",
  cta_placeholder_text = "your phone number",
  cta_error_message = "Not a valid Spanish Phone Number",
  on_submit_redirect_url,
}: PhoneInputProps) => {
  const redirectLink = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);
  const [sending, setSending] = useState(false);
  function handlePhoneInput(event: any) {
    event.preventDefault();
    setPhoneNumber(event.target.value);
    if (!validPhoneNumber) validatePhoneNumber(event.target.value);
  }
  function validatePhoneNumber(phoneNumber: string) {
    let cleanedPhoneNumber = phoneNumber
      .replaceAll(" ", "")
      .replaceAll("+", "")
      .replaceAll("-", "");
    if (!cleanedPhoneNumber.startsWith("34")) {
      cleanedPhoneNumber = "34" + cleanedPhoneNumber;
    }
    cleanedPhoneNumber = "+" + cleanedPhoneNumber;

    // console.log("phoneNumber", phoneNumber);

    if (cleanedPhoneNumber.length == 12) {
      setValidPhoneNumber(true);
      return true;
    } else {
      setValidPhoneNumber(false);
      return false;
    }
  }
  function handleSubmit() {
    if (validatePhoneNumber(phoneNumber)) {
      setSending(true);
      fetch(webhook_url, {
        method: "POST",
        body: JSON.stringify({
          phone: phoneNumber,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSending(false);
          // console.log("response", data);
          console.log("redirectLink", redirectLink);
          if (redirectLink.current) redirectLink?.current?.click();
        })
        .catch((err) => {
          setSending(false);
          console.error("error: failed to submit phone number");
        });
    }
  }
  return (
    <div className="w-full px-0 mobile:px-4">
      <div className="bg-[#e7e7e7] max-w-2xl w-full h-10 mobile:h-12 md:h-14 mx-auto rounded-full overflow-hidden">
        <div className="flex h-full w-full">
          <div className="w-20 flex items-center justify-center">
            <Image
              src="/form-hand.webp"
              alt="hello"
              height={42}
              width={42}
              className={clsx(
                styles.shake,
                "w-full max-w-[16px] mobile:max-w-[24px] md:max-w-[30px]"
              )}
            ></Image>
          </div>
          <div className="w-full relative">
            <input
              className={clsx(
                "h-full w-full bg-transparent text-sm mobile:text-lg md:text-xl",
                styles.input
              )}
              type="number"
              value={phoneNumber}
              onChange={handlePhoneInput}
              // onInput={handlePhoneInput}
              placeholder={cta_placeholder_text || "enter your phone number"}
            ></input>
          </div>
          <div
            className="w-32 mobile:w-48 h-full flex items-center cursor-pointer"
            style={{ backgroundColor: cta_background_color || "#cff128" }}
            onClick={handleSubmit}
          >
            <div
              className="w-full text-sm mobile:text-lg md:text-xl text-center mobile:pl-3 text-black font-bold line-clamp-3 !leading-3 mobile:!leading-4 md:!leading-5"
              style={{
                color: cta_text_color || "#000000",
              }}
            >
              {cta_text}
            </div>
            <div className="w-12 mobile:w-20 md:w-24">
              <ArrowLottieAnimation
                color={cta_text_color || "#000000"}
                animationData={sending ? circleLoader : animation}
              />
            </div>
          </div>
        </div>
      </div>
      {!validPhoneNumber && (
        <div className="relative bottom-0 text-sm text-red-500 text-center w-full">
          {cta_error_message}
        </div>
      )}
      <PrismicNextLink
        ref={redirectLink}
        field={on_submit_redirect_url}
      ></PrismicNextLink>
    </div>
  );
};

export default PhoneInput;
