import React from "react";

export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="donate" viewBox="0 0 576 512">
          <path
            fill="currentColor"
            d="M275.3 250.5c7 7.4 18.4 7.4 25.5 0l108.9-114.2c31.6-33.2 29.8-88.2-5.6-118.8-30.8-26.7-76.7-21.9-104.9 7.7L288 36.9l-11.1-11.6C248.7-4.4 202.8-9.2 172 17.5c-35.3 30.6-37.2 85.6-5.6 118.8l108.9 114.2z"
          />
          <path
            fill="currentColor"
            d="M565.3 328.1c-11.8-10.7-30.2-10-42.6 0L430.3 402c-11.3 9.1-25.4 14-39.9 14H192c-17.7 0-32-14.3-32-32s14.3-32 32-32h16c8.8 0 16-7.2 16-16s-7.2-16-16-16h-16c-35.3 0-64 28.7-64 64s28.7 64 64 64h198.4c19.1 0 37.4-7.6 50.9-21.2l92.4-91.8c12.3-12.3 12.3-32.3 0-43z"
          />
        </symbol>
        <symbol id="heart" viewBox="0 0 16 16">
          <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
        </symbol>
        <symbol id="arrow" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
          />
        </symbol>
        <symbol id="pulse" viewBox="0 0 16 16">
          <path d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9H1.475Z" />
          <path d="M.88 8C-2.427 1.68 4.41-2 7.823 1.143c.06.055.119.112.177.171a2.612 2.612 0 0 1 .177-.171C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.88Z" />
        </symbol>
        <symbol id="cap" viewBox="0 0 16 16">
          <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
          <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
        </symbol>
        <symbol id="drop" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6ZM6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13Z"
          />
        </symbol>
        <symbol id="people" viewBox="0 0 16 16">
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        </symbol>
        <symbol id="person" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </symbol>
        <symbol id="pin" viewBox="0 0 16 16">
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
        </symbol>
        <symbol id="tel" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
          />
        </symbol>
        <symbol id="mail" viewBox="0 0 16 16">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
        </symbol>
        <symbol id="fb" viewBox="0 0 16 16">
          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
        </symbol>
        <symbol id="yt" viewBox="0 0 16 16">
          <path d="M2 3h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm4.5 2.2v5.6L11 8 6.5 5.2Z" fillRule="evenodd" />
        </symbol>
        <symbol id="ig" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M5 0h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5Zm0 1.5A3.5 3.5 0 0 0 1.5 5v6A3.5 3.5 0 0 0 5 14.5h6a3.5 3.5 0 0 0 3.5-3.5V5A3.5 3.5 0 0 0 11 1.5H5ZM8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4-2.3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
          />
        </symbol>
        <symbol id="cal" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5ZM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1Z"
          />
        </symbol>
        <symbol id="tree" viewBox="0 0 16 16">
          <path d="M8 0c3 2 5 4.500 5 7 0 1.500-.700 2.700-1.800 3.500L12 13H9v3H7v-3H4l.800-2.500C3.700 9.700 3 8.500 3 7c0-2.500 2-5 5-7Z" />
        </symbol>
        <symbol id="star" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.730L.173 6.765c-.329-.314-.158-.888.283-.950l4.898-.696L7.538.792c.197-.39.730-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.950l-3.522 3.356.830 4.730c.078.443-.360.790-.746.592L8 13.187l-4.389 2.256z" />
        </symbol>
        <symbol id="gullak" viewBox="0 0 24 24">
          <circle cx="12" cy="2.5" r="1.75" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-2h2v2a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4c1-.5 1.7-1 2-2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1c0-1-.5-1.5-1-2V5h-2zm-6 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
          />
        </symbol>
        <symbol id="healthcare" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM11 7v3H8v2h3v3h2v-3h3v-2h-3V7h-2z"
          />
        </symbol>
        <symbol id="education" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
        </symbol>
        <symbol id="healthcare-education" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 8-4v5h2V7L12 2zm-6 9.2v4.3c0 2.2 2.7 4 6 4s6-1.8 6-4v-4.3l-6 3-6-3z" />
          <path d="M19 13v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" />
        </symbol>
      </defs>
    </svg>
  );
}

export function Icon({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const combinedClass = className ? `i ${className}` : "i";
  return (
    <svg className={combinedClass} fill="currentColor" style={style} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}

// Dedicated React Icon Components
export function GullakIcon({ className = "h-4 w-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`i ${className}`} aria-hidden="true" {...props}>
      <circle cx="12" cy="2.5" r="1.75" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-2h2v2a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4c1-.5 1.7-1 2-2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1c0-1-.5-1.5-1-2V5h-2zm-6 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
    </svg>
  );
}

export function HealthcareEducationIcon({ className = "h-4 w-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`i ${className}`} aria-hidden="true" {...props}>
      <path d="M12 2L2 7l10 5 8-4v5h2V7L12 2zm-6 9.2v4.3c0 2.2 2.7 4 6 4s6-1.8 6-4v-4.3l-6 3-6-3z" />
      <path d="M19 13v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z" />
    </svg>
  );
}

export function HealthcareIcon({ className = "h-4 w-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`i ${className}`} aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM11 7v3H8v2h3v3h2v-3h3v-2h-3V7h-2z"
      />
    </svg>
  );
}

export function EducationIcon({ className = "h-4 w-4", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`i ${className}`} aria-hidden="true" {...props}>
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );
}
