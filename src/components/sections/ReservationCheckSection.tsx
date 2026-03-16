"use client";

import { useState } from "react";

interface ReservationResult {
  date: string;
  timeSlot: string;
  type: string;
  name: string;
  phone: string;
  totalPeople: string;
  status: string;
}

export default function ReservationCheckSection() {
  const [checkName, setCheckName] = useState("");
  const [checkPhone, setCheckPhone] = useState("");
  const [results, setResults] = useState<ReservationResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleNameChange = (value: string) => {
    const filtered = value.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "").slice(0, 10);
    setCheckName(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // TODO: API 연동 - 현재는 가데이터
    if (checkName === "이강원" && checkPhone === "010-2998-9985") {
      setResults([
        {
          date: "2026년 03월 22일 (일)",
          timeSlot: "오전2",
          type: "단체",
          name: "이강원",
          phone: "010-2998-9985",
          totalPeople: "15",
          status: "예약완료",
        },
      ]);
    } else {
      setResults([]);
    }
  };

  const isSearchValid = checkName.trim() && checkPhone.trim();

  return (
    <div>
      <div className="reservation-form">
        <h3 className="form-title">예약 조회</h3>
        <p className="check-desc">
          예약 시 입력한 정보를 정확히 입력해주세요.
        </p>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">
              신청인 성명<span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="성명을 입력하세요"
              value={checkName}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              연락처<span className="required">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="010-0000-0000"
              value={checkPhone}
              onChange={(e) => setCheckPhone(formatPhone(e.target.value))}
              maxLength={13}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isSearchValid}
          >
            예약 조회하기
          </button>
        </form>
      </div>

      {searched && (
        <div className="check-results">
          {results && results.length > 0 ? (
            <div className="check-result-list">
              {results.map((item, i) => (
                <div key={i} className="check-result-card">
                  <div className="check-result-row">
                    <span className="check-result-label">날짜</span>
                    <span className="check-result-value">{item.date}</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">시간</span>
                    <span className="check-result-value">{item.timeSlot}</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">구분</span>
                    <span className="check-result-value">{item.type}</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">신청인</span>
                    <span className="check-result-value">{item.name}</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">인원</span>
                    <span className="check-result-value">{item.totalPeople}명</span>
                  </div>
                  <div className="check-result-row">
                    <span className="check-result-label">상태</span>
                    <span className="check-result-value check-status">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="check-empty">
              <p>조회된 예약이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
