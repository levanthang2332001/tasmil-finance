/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const swapSchema = z.object({
  user_address: z.string().min(1, "User address required"),
  fromToken: z.string().min(1, "From token required"),
  toToken: z.string().min(1, "To token required"),
  fromAmount: z.number().min(0, "From amount must be positive"),
  toAmount: z.number().min(0, "To amount must be positive"),
  interactiveToken: z.string().min(1, "Interactive token required"),
  curveType: z.enum(["stable", "uncorrelated"], {
    required_error: "Curve type is required",
  }),
  version: z.union([z.literal(0), z.literal(0.5)], {
    required_error: "Version is required",
  }),
});

interface SwapApiParams {
  endpoint: string;
  req: NextRequest;
  parseInput: (input: any) => z.SafeParseReturnType<any, any>;
  getInput: () => Promise<any>;
  errorPrefix: string;
}

/**
 * Helper to forward swap requests to backend and handle validation, errors, and response.
 */
async function handleSwapApi({ endpoint, req, parseInput, getInput, errorPrefix }: SwapApiParams) {
  try {
    const input = await getInput();
    const parseResult = parseInput(input);
    if (!parseResult.success)
      return NextResponse.json(
        { error: `Invalid ${errorPrefix} request`, details: parseResult.error.flatten() },
        { status: 400 }
      );

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL ?? ""}${endpoint}`;
    const backendRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: req.headers.get("cookie") ?? "" },
      body: JSON.stringify(parseResult.data),
      credentials: "include",
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json(
        { error: `${errorPrefix} failed`, details: errorText },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`${errorPrefix} API error:`, error);
    return NextResponse.json(
      {
        error: "Unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/swap
 * Handles both pre-swap rate calculation and swap execution based on the request body.
 * If action=pre_swap, forwards to backend /swap/pre-swap
 * If action=swap or no action, forwards to backend /swap/swap
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === "pre_swap") {
      return handleSwapApi({
        endpoint: "/swap/pre-swap",
        req,
        parseInput: (input) => swapSchema.safeParse(input),
        getInput: async () => body,
        errorPrefix: "pre-swap",
      });
    } else {
      return handleSwapApi({
        endpoint: "/swap/swap",
        req,
        parseInput: (input) => swapSchema.safeParse(input),
        getInput: async () => body,
        errorPrefix: "swap",
      });
    }
  } catch (error) {
    console.error("Swap API error:", error);
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
