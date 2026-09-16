"use client";

import {
  FontAwesomeIcon as FAIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Mencegah FontAwesome menambahkan CSS secara otomatis karena sudah diimport Manually di atas
config.autoAddCss = false;

export default function FontAwesomeIcon(props: FontAwesomeIconProps) {
  return <FAIcon {...props} />;
}
