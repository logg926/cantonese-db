export const matchesVoiceFilters = (voice: string, filters: string[]) => {
  if (filters.length === 0) return true;

  const normalizedVoice = voice.toLocaleLowerCase();
  const voiceCodes = voice.match(/[SATB]{2,}/g) ?? [];
  const hasMixedCode = voiceCodes.some(
    (code) => /[SA]/.test(code) && /[TB]/.test(code),
  );
  const hasHighCode = voiceCodes.some(
    (code) => /[SA]/.test(code) && !/[TB]/.test(code),
  );
  const hasLowCode = voiceCodes.some(
    (code) => !/[SA]/.test(code) && /[TB]/.test(code),
  );

  return filters.some((filter) => {
    if (filter === "Mixed") {
      return normalizedVoice.includes("mixed") || hasMixedCode;
    }
    if (filter === "High") {
      return (
        normalizedVoice.includes("high voice") ||
        normalizedVoice.includes("treble") ||
        normalizedVoice.includes("women") ||
        normalizedVoice.includes("female") ||
        hasHighCode
      );
    }
    if (filter === "Low") {
      return (
        normalizedVoice.includes("low voice") ||
        normalizedVoice.includes("men") ||
        normalizedVoice.includes("male") ||
        hasLowCode
      );
    }
    if (filter === "Unison") {
      return (
        normalizedVoice.includes("unison") ||
        normalizedVoice.includes("single voice") ||
        normalizedVoice.includes("one voice")
      );
    }
    return false;
  });
};

export const matchesAccompanimentFilters = (
  instrument: string,
  filters: string[],
) => {
  if (filters.length === 0) return true;

  const normalizedInstrument = instrument.trim().toLocaleLowerCase();
  const hasNoInstrumentData =
    normalizedInstrument === "" ||
    /^(?:n[./]?a[.]?|none|not applicable|not specified)$/.test(
      normalizedInstrument,
    );
  const isAcappella =
    normalizedInstrument.includes("a cappella") ||
    normalizedInstrument.includes("acappella") ||
    normalizedInstrument === "" ||
    normalizedInstrument === "none";
  const isChineseInstrument =
    /chinese|erhu|gaohu|zheng|guzheng|pipa|dizi|sheng|ruan|yangqin|suona|hulusi|zhonghu|xiao|qin|nan bang zi|中樂|民樂|二胡|高胡|古箏|琵琶|笛|笙|阮|揚琴|嗩吶/.test(
      normalizedInstrument,
    );
  const isWesternInstrument =
    /piano|organ|orchestra|violin|viola|cello|double bass|strings?|woodwind|brass|percussion|guitar|harp|flute|oboe|clarinet|bassoon|horn|trumpet|trombone|tuba|accordion|saxophone|harmonica|crystal glass|electronic|synth/.test(
      normalizedInstrument,
    ) ||
    (!hasNoInstrumentData && !isAcappella && !isChineseInstrument);

  return filters.some((filter) => {
    if (filter === "A cappella") return isAcappella;
    if (filter === "Piano") return normalizedInstrument.includes("piano");
    if (filter === "Organ") return normalizedInstrument.includes("organ");
    if (filter === "Western") return isWesternInstrument;
    if (filter === "Chinese") return isChineseInstrument;
    return false;
  });
};
