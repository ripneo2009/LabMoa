"use client";

import * as React from "react";
import { CalendarCheck, CheckCircle2, MessageSquare, Send } from "lucide-react";

import { Button, Card, Input, Textarea } from "@/components/ui";
import { SafetyTrainingGate } from "./SafetyTrainingGate";
import { TimeSlotGrid, addMinutes } from "./TimeSlotGrid";
import { WeekCalendar } from "./WeekCalendar";

interface ReservationContact {
  id: string;
  name: string;
  subtitle: string;
}

interface ConsultationMessage {
  id: string;
  sender: "user" | "contact";
  text: string;
}

interface LabReservationFlowProps {
  labId: string;
  labName: string;
  contacts: ReservationContact[];
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function LabReservationFlow({ labId, labName, contacts }: LabReservationFlowProps) {
  const availableContacts = contacts.length
    ? contacts
    : [{ id: `${labId}-coordinator`, name: `${labName} 예약 담당자`, subtitle: "연구실 일정 및 실험 상담" }];
  const [trainingComplete, setTrainingComplete] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [start, setStart] = React.useState<string | null>(null);
  const [end, setEnd] = React.useState<string | null>(null);
  const [experiment, setExperiment] = React.useState("");
  const [contactId, setContactId] = React.useState(availableContacts[0].id);
  const [draft, setDraft] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [messages, setMessages] = React.useState<ConsultationMessage[]>([]);
  const selectedContact = availableContacts.find((contact) => contact.id === contactId) ?? availableContacts[0];

  function handleDate(date: string) {
    setSelectedDate(date);
    setStart(null);
    setEnd(null);
    setConfirmed(false);
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        sender: "contact",
        text: `${date} 예약 상담을 시작합니다. 진행하려는 실험과 필요한 장비를 알려주세요.`,
      }]);
    }
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: crypto.randomUUID(), sender: "user", text }]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        sender: "contact",
        text: "내용을 확인했습니다. 선택한 일정과 장비 사용 가능 여부를 검토해 안내드리겠습니다.",
      }]);
    }, 500);
  }

  if (!trainingComplete) {
    return <SafetyTrainingGate labName={labName} onContinue={() => setTrainingComplete(true)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-5 p-5">
        <div className="flex items-center gap-2">
          <CalendarCheck className="size-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-medium text-foreground">예약 날짜 선택</h2>
            <p className="text-xs text-muted-foreground">날짜를 선택하면 시간과 상담 화면이 열립니다.</p>
          </div>
        </div>
        <WeekCalendar selectedDate={selectedDate ?? todayKey()} onSelectDate={handleDate} />
      </Card>

      {selectedDate && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <div className="flex flex-col gap-6">
            <Card className="gap-5 p-5">
              <div>
                <h2 className="font-medium text-foreground">예약 시간</h2>
                <p className="mt-1 text-xs text-muted-foreground">{selectedDate}</p>
              </div>
              <TimeSlotGrid
                bookedRanges={[]}
                selectedStart={start}
                selectedEnd={end}
                onSelectStart={(time) => {
                  setStart(time);
                  setEnd(addMinutes(time, 60));
                }}
                onSelectEnd={setEnd}
              />
            </Card>

            <Card className="gap-4 p-5">
              <div>
                <h2 className="font-medium text-foreground">진행할 실험</h2>
                <p className="mt-1 text-xs text-muted-foreground">실험 목적, 방법, 필요한 장비를 적어주세요.</p>
              </div>
              <Textarea
                value={experiment}
                onChange={(event) => setExperiment(event.target.value)}
                placeholder="예: 촉매 반응 수율 측정을 위해 HPLC 분석이 필요합니다."
                rows={5}
              />
            </Card>

            <Button
              type="button"
              size="lg"
              disabled={!start || !end || !experiment.trim() || confirmed}
              onClick={() => setConfirmed(true)}
            >
              {confirmed ? <CheckCircle2 aria-hidden="true" /> : <CalendarCheck aria-hidden="true" />}
              {confirmed ? "예약 요청 완료" : "예약 요청하기"}
            </Button>
          </div>

          <Card className="min-h-[34rem] gap-0 p-0">
            <div className="border-b border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="size-5 text-primary" aria-hidden="true" />
                <h2 className="font-medium text-foreground">연구소 상담</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableContacts.map((contact) => (
                  <Button
                    key={contact.id}
                    type="button"
                    size="sm"
                    variant={contact.id === contactId ? "default" : "outline"}
                    onClick={() => setContactId(contact.id)}
                  >
                    {contact.name}
                  </Button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{selectedContact.subtitle}</p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="h-80 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
              </div>
              <form
                className="flex gap-2 border-t border-border p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
              >
                <div className="min-w-0 flex-1">
                  <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="상담 메시지 입력" />
                </div>
                <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="메시지 보내기">
                  <Send aria-hidden="true" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export { LabReservationFlow };
