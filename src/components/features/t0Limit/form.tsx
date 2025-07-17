"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import debounce from "lodash.debounce";
import { useLocale } from "@/context/locale";
import formatNumber from "@/lib/utils/formatNumber";
import LoadingOverlay from "@/components/commons/loadingOverlay";
import { useAlertStore } from "@/store/notification/useAlertStore";
import AutoCompleteInput from "@/components/commons/autoCompleteInput";
import NumberInput from "@/components/commons/inputs/numberInput";

interface Customer {
  targetAcc: string;
  fullName: string;
  formattedTitle: string;
}

interface AccountSearchResponse {
  targetAcc: string;
  fullName: string;
  [key: string]: unknown;
}

const schema = yup.object().shape({
  maxQuotaInput: yup.number().required().max(100),
  creditLineT0: yup.number().required().min(0),
});

export default function T0LimitForm() {
  const { messages } = useLocale();
  const alertStore = useAlertStore();
  const t = useCallback((key: string) => messages[key] || key, [messages]);

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("022C");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const [marginLimit, setMarginLimit] = useState(0);
  const [pOut, setPOut] = useState(0);
  const [cash, setCash] = useState(0);
  const [pOutsNetCash, setPOutsNetCash] = useState(0);
  const [pPO, setPPO] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [nav, setNav] = useState(0);
  const [realRatio, setRealRatio] = useState(0);
  const [maxQuotaLimit, setMaxQuotaLimit] = useState(0);
  const [estimatedRealRatio, setEstimatedRealRatio] = useState(0);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      maxQuotaInput: 50,
      creditLineT0: 0,
    },
  });

  const maxQuotaInput = watch("maxQuotaInput");
  const creditLineT0 = watch("creditLineT0");

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/account-search`,
        { searchInput: searchQuery, page },
        { withCredentials: true }
      );

      const formatted: Customer[] = (
        response.data as AccountSearchResponse[]
      ).map((c) => ({
        ...c,
        formattedTitle: `${c.targetAcc} - ${c.fullName}`,
      }));

      setCustomers(formatted);

      if (
        searchQuery.length === 10 &&
        formatted.length === 1 &&
        formatted[0].targetAcc === searchQuery
      ) {
        setSelectedCustomer(formatted[0].targetAcc);
      }
    } catch (err) {
      console.error("fetchCustomers error", err);
    }
  }, [searchQuery, page]);

  const debouncedFetchCustomers = useMemo(
    () => debounce(fetchCustomers, 500),
    [fetchCustomers]
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);
    setPage(1);
    if (value.startsWith("022C") && value.length <= 10) {
      debouncedFetchCustomers();
    }
  };

  const handleCustomerSelect = (value: string) => {
    setSelectedCustomer(value);
    setInputValue(value);
  };

  const submitForm = useCallback(async () => {
    if (!selectedCustomer) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/accounts/t0-limit`,
        {
          targetAcc: selectedCustomer,
          maxQuotaLimit: maxQuotaInput,
          creditlineT0: creditLineT0,
        },
        { withCredentials: true }
      );

      setMarginLimit(data.margin_limit);
      setPOut(data.p_outs);
      setCash(data.cash);
      setPOutsNetCash(data.pOuts_net_cash);
      setPPO(data.p_p0);
      setTotalAssets(data.total_assets);
      setNav(data.nav);
      setRealRatio(data.real_ratio);
      setMaxQuotaLimit(data.max_quote_limit);
      setEstimatedRealRatio(data.estimated_realratio);
    } catch (e: unknown) {
      const error = axios.isAxiosError(e) ? e.response?.data?.message : null;
      if (error === "acc_not_found" || error === "api_data_error") {
        alertStore.showError(t("acc_not_found"));
      } else {
        alertStore.showError(t("unexpected_error_message"));
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, maxQuotaInput, creditLineT0, alertStore, t]);

  const debouncedSubmitForm = useMemo(
    () => debounce(submitForm, 500),
    [submitForm]
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (selectedCustomer) submitForm();
  }, [selectedCustomer, submitForm]);

  useEffect(() => {
    if (creditLineT0 !== null) debouncedSubmitForm();
  }, [creditLineT0, debouncedSubmitForm]);

  useEffect(() => {
    if (maxQuotaInput !== null) debouncedSubmitForm();
  }, [maxQuotaInput, debouncedSubmitForm]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative text-text">
      {loading && <LoadingOverlay />}

      <div className="bg-background p-3 mb-4 rounded-md flex items-center gap-x-3">
        <div className="text-xl font-bold text-text-title">{t("account")}</div>
        <div className="w-1/2">
          <AutoCompleteInput
            value={inputValue}
            onSearch={handleSearchChange}
            onSelect={handleCustomerSelect}
            items={customers}
            itemTitle="formattedTitle"
            itemValue="targetAcc"
            placeholder="Tìm kiếm mã 022C..."
          />
        </div>
      </div>

      <table className="w-full border border-border rounded-md">
        <tbody>
          {(
            [
              ["margin_limit", marginLimit],
              ["p_outs", pOut],
              ["cash", cash],
              ["p_outs_net_cash", pOutsNetCash],
              ["pp0", pPO],
              ["total_assets", totalAssets],
              ["nav", nav],
              ["real_ratio", `${realRatio}%`],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <tr
              key={label}
              className="flex justify-between px-3 py-2 border-b border-border"
            >
              <td className="font-semibold text-lg">{t(label)}</td>
              <td className="font-normal text-lg">
                {formatNumber(String(value))}
              </td>
            </tr>
          ))}

          <tr className="grid grid-cols-3 gap-4 px-3 py-2 border-b border-border items-center">
            <td className="col-span-1 font-semibold">{t("max_quota_limit")}</td>
            <td className="col-span-1">
              <input
                {...register("maxQuotaInput")}
                disabled
                className="w-full max-w-[150px] h-9 rounded-md text-right bg-background border border-border"
              />
            </td>
            <td className="col-span-1 text-right font-medium">
              {formatNumber(String(maxQuotaLimit))}
            </td>
          </tr>

          <tr className="grid grid-cols-3 gap-4 px-3 py-2 border-b border-border items-center">
            <td className="col-span-1 font-semibold">
              {t("max_quota_limit_suggest")}
            </td>
            <td className="col-span-2">
              <Controller
                name="creditLineT0"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    className={`w-full max-w-[150px] h-9 rounded-md text-right bg-background border ${
                      errors.creditLineT0 ? "border-red-500" : "border-border"
                    }`}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="flex justify-between px-3 py-2">
            <td className="font-semibold">{t("real_ratio_estimate")}</td>
            <td>{estimatedRealRatio}%</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-5 font-semibold text-text">{t("notice")}</p>
    </form>
  );
}
