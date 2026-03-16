import type { TimeSlots } from "@/types";

export const TIME_SLOTS: TimeSlots = {
  morning: ["오전1", "오전2", "오전3", "오전4"],
  afternoon: ["오후1", "오후2", "오후3", "오후4"],
  night: ["야간1", "야간2"],
};

export const MAX_CAPACITY = 20;

// TODO: API 연동 후 삭제 - 가데이터
export const MOCK_SLOT_COUNT: Record<string, number> = {
  "오전1": 2,
  "오전2": 15,
  "오전3": 0,
  "오전4": 20,
  "오후1": 5,
  "오후2": 8,
  "오후3": 0,
  "오후4": 12,
  "야간1": 3,
  "야간2": 0,
};
