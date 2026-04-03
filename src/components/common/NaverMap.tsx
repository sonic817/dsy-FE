"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    naver?: {
      maps?: any;
    };
  }
}

interface NaverMapProps {
  active: boolean;
  latitude: number;
  longitude: number;
  label?: string;
}

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";
const INFO_WINDOW_CONTENT = [
  '<div class="naver-map-info-window">',
  "  <h3>다율숲</h3>",
  "  <p><strong>오시는 길</strong></p>",
  "  <p>주소: 울산광역시 북구 동남로 477</p>",
  '  <p>교통편: 네비게이션 "다율숲" 검색 자차이용</p>',
  "</div>",
].join("");

export default function NaverMap({ active, latitude, longitude, label }: NaverMapProps) {
  const mapElementId = `naver-map-${useId().replace(/:/g, "")}`;
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "missing-key">(
    NAVER_MAP_CLIENT_ID ? "idle" : "missing-key"
  );

  useEffect(() => {
    if (!active) {
      return;
    }

    if (!NAVER_MAP_CLIENT_ID) {
      setStatus("missing-key");
      return;
    }

    const naverMaps = window.naver?.maps;
    if (!scriptReady || !naverMaps) {
      setStatus("loading");
      return;
    }

    const position = new naverMaps.LatLng(latitude, longitude);

    if (!mapRef.current) {
      mapRef.current = new naverMaps.Map(mapElementId, {
        center: position,
        zoom: 18,
        minZoom: 11,
        maxZoom: 19,
        draggable: true,
        pinchZoom: true,
        scrollWheel: true,
        keyboardShortcuts: true,
        disableDoubleTapZoom: false,
        disableDoubleClickZoom: false,
        disableTwoFingerTapZoom: false,
        disableKineticPan: false,
        tileTransition: true,
        zoomControl: true,
        zoomControlOptions: {
          position: naverMaps.Position.TOP_RIGHT,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: naverMaps.Position.TOP_RIGHT,
          style: naverMaps.MapTypeControlStyle.BUTTON,
          mapTypeIds: [naverMaps.MapTypeId.NORMAL, naverMaps.MapTypeId.SATELLITE],
        },
        mapDataControl: true,
        mapDataControlOptions: {
          position: naverMaps.Position.BOTTOM_LEFT,
        },
        scaleControl: true,
        scaleControlOptions: {
          position: naverMaps.Position.BOTTOM_RIGHT,
        },
        logoControl: false,
      });

      // 네이버 로고 숨기기
      const hideLogo = () => {
        const mapEl = document.getElementById(mapElementId);
        if (!mapEl) return;
        const anchors = mapEl.querySelectorAll('a[href*="naver.com"], a[href*="pstatic.net"]');
        anchors.forEach((a) => {
          const wrapper = a.parentElement;
          if (wrapper) wrapper.style.display = "none";
        });
      };
      hideLogo();
      setTimeout(hideLogo, 300);
      setTimeout(hideLogo, 1000);

      markerRef.current = new naverMaps.Marker({
        position,
        map: mapRef.current,
        title: label || "지도 위치",
      });

      infoWindowRef.current = new naverMaps.InfoWindow({
        content: INFO_WINDOW_CONTENT,
        borderWidth: 0,
        backgroundColor: "#fff",
        disableAnchor: false,
        pixelOffset: new naverMaps.Point(0, 12),
      });

      naverMaps.Event.addListener(mapRef.current, "zoom_changed", (zoom: number) => {
        console.log("[NaverMap] zoom:", zoom);
      });

      naverMaps.Event.addListener(markerRef.current, "click", () => {
        if (!infoWindowRef.current) {
          return;
        }

        if (infoWindowRef.current.getMap()) {
          infoWindowRef.current.close();
        } else {
          infoWindowRef.current.open(mapRef.current, markerRef.current);
        }
      });

      infoWindowRef.current.open(mapRef.current, markerRef.current);
    } else {
      mapRef.current.setCenter(position);
      markerRef.current?.setPosition(position);
      infoWindowRef.current?.setPosition(position);
    }

    setStatus("ready");
  }, [active, label, latitude, longitude, mapElementId, scriptReady]);

  return (
    <div className="intro-map">
      {NAVER_MAP_CLIENT_ID ? (
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
      ) : null}

      <div id={mapElementId} className="intro-map-canvas" />

      {status !== "ready" && (
        <div className="intro-map-status">
          {status === "missing-key"
            ? "네이버 지도 Client ID를 설정하면 지도가 표시됩니다."
            : "지도를 불러오는 중입니다."}
        </div>
      )}
    </div>
  );
}
