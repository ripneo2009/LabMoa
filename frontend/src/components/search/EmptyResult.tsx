// 검색 결과가 없을 때의 빈 상태
function EmptyResult() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
      <p className="font-medium text-foreground">조건에 맞는 연구실이 아직 없어요</p>
      <p className="text-sm text-muted-foreground">
        지역이나 분야 조건을 조금 넓혀서 다시 찾아보세요.
      </p>
    </div>
  );
}

export { EmptyResult };
