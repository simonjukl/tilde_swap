# Basic formulas
x ~ y
cyl + disp + hp ~ mpg
age + sex + treatment ~ outcome

# case_when — select the inner lines and swap all at once
group <- dplyr::case_when(
  x < 0 ~ "negative",
  x == 0 ~ "zero",
  x > 0 ~ "positive",
  TRUE ~ NA_character_
)

# recode_values (formula API) — trailing commas should be preserved
x <- c("NC", "NYC", "CA", NA, "Unknown")

recode_values(
  x,
  "NC" ~ "North Carolina",
  "NYC" ~ "New York",
  "CA" ~ "California",
  default = "<not recorded>"
)

# replace_values — single and grouped LHS
replace_values(x, "NYC" ~ "NY")
replace_values(x, NA ~ "Unknown (NA)")
replace_values(x, "Unknown" ~ NA)

replace_values(
  x,
  c(NA, "Unknown") ~ "<not recorded>"
)

# recode_values with numeric keys (Likert scale)
recode_values(
  score,
  1 ~ "Strongly disagree",
  2 ~ "Disagree",
  3 ~ "Neutral",
  4 ~ "Agree",
  5 ~ "Strongly agree"
)

# recode_values with grouped LHS (list of vectors)
recode_values(
  schools,
  c("UNC", "Chapel Hill" ~ "UNC"),
  c("Duke", "Duke University" ~ "Duke"),
  c("NC State" ~ "NC State"),
  c("ECU", "East Carolina" ~ "ECU"),
  NA ~ NA,
  unmatched = "error"
)
