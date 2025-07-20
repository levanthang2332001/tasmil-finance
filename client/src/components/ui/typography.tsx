import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority";
/**
 * Typography component
 * @param {string} variant - The variant of the typography.
 * @param {string} weight - The weight of the typography.
 * @param {string} align - The alignment of the typography.
 * @param {string} font - The font family to use.
 * @param {string} size - The size of the text.
 * @param {React.ElementType} as - The element type to render the typography as.
 * @param {React.ReactNode} children - The children of the typography.
 * @param {string} className - The class name to apply to the typography.
 * @param {React.ComponentPropsWithoutRef<C>} props - The props to apply to the typography.
 * @returns {React.ReactElement} The typography component.
 * @example
 * <Typography>Nomal text</Typography>
 * <Typography variant="h1">Heading 1</Typography>
 * <Typography variant="h2">Heading 2</Typography>
 * <Typography variant="h3">Heading 3</Typography>
 * <Typography variant="lead">Lead text</Typography>
 * <Typography variant="large">Large text</Typography>
 * <Typography variant="small">Small text</Typography>
 * <Typography variant="muted">Muted text</Typography>
 * <Typography weight="normal">Normal text</Typography>
 * <Typography weight="medium">Medium text</Typography>
 * <Typography weight="bold">Bold text</Typography>
 * <Typography align="left">Align left</Typography>
 * <Typography align="center">Align center</Typography>
 * <Typography align="right">Align right</Typography>
 * <Typography variant="h1" align="center" weight="bold">Heading 1 align center and bold</Typography>
 * <Typography as="span" variant="small">Inline text</Typography>
 * <Typography as="label" variant="muted">Form label</Typography>
 * <Typography className="my-4 text-blue-500">Text with margin and custom color</Typography>
 * <Typography gradient>Gradient text</Typography>
 */
const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20",
      h2: "scroll-m-20",
      h3: "scroll-m-20",
      h4: "scroll-m-20",
      h5: "scroll-m-20",
      p: "",
      small: "",
    },
    font: {
      default: "font-darkerGrotesk",
      labGrotesk: "font-labGrotesk",
      darkerGrotesk: "font-darkerGrotesk",
      mono: "font-mono",
      sans: "font-sans",
      geistMono: "font-geistMono",
      ppNeue: "font-ppNeue",
      sfPro: "font-sfPro",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      embossed: "text-embossed",
      submerged: "text-submerged",
      boosted: "text-boosted",
      destructive: "text-destructive",
      foreground: "text-foreground",
      background: "text-background",
    },
    gradient: {
      true: "bg-gradient-to-r from-[#B5EAFF] to-[#00BFFF] bg-clip-text text-transparent",
      false: "",
    },
    size: {
      // Default sizes
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
      "8xl": "text-8xl",
      "9xl": "text-9xl",
      "10xl": "text-10xl",

      // PP Neue Montreal specific sizes
      "xs-ppneue": "text-xs",
      "sm-ppneue": "text-sm",
      "base-ppneue": "text-base",
      "lg-ppneue": "text-lg",
      "xl-ppneue": "text-xl",
      "2xl-ppneue": "text-2xl",
      "3xl-ppneue": "text-3xl",
      "4xl-ppneue": "text-4xl",
      "5xl-ppneue": "text-5xl",
      "6xl-ppneue": "text-6xl",
      "7xl-ppneue": "text-7xl",
      "8xl-ppneue": "text-8xl",
      "9xl-ppneue": "text-9xl",
      "10xl-ppneue": "text-10xl",

      // Darker Grotesk specific sizes
      "xs-darker": "text-xs-darker",
      "sm-darker": "text-sm-darker",
      "base-darker": "text-base-darker",
      "lg-darker": "text-lg-darker",
      "xl-darker": "text-xl-darker",
      "2xl-darker": "text-2xl-darker",
      "3xl-darker": "text-3xl-darker",
      "4xl-darker": "text-4xl-darker",
      "5xl-darker": "text-5xl-darker",
      "6xl-darker": "text-6xl-darker",
      "7xl-darker": "text-7xl-darker",
      "8xl-darker": "text-8xl-darker",
      "9xl-darker": "text-9xl-darker",
      "10xl-darker": "text-10xl-darker",

      // Lab Grotesk specific sizes
      "xs-lab": "text-xs-lab",
      "sm-lab": "text-sm-lab",
      "base-lab": "text-base-lab",
      "lg-lab": "text-lg-lab",
      "xl-lab": "text-xl-lab",
      "2xl-lab": "text-2xl-lab",
      "3xl-lab": "text-3xl-lab",
      "4xl-lab": "text-4xl-lab",
      "5xl-lab": "text-5xl-lab",
      "6xl-lab": "text-6xl-lab",
      "7xl-lab": "text-7xl-lab",
      "8xl-lab": "text-8xl-lab",
      "9xl-lab": "text-9xl-lab",
      "10xl-lab": "text-10xl-lab",

      // Geist Mono specific sizes
      "xs-geist": "text-xs-geist",
      "sm-geist": "text-sm-geist",
      "base-geist": "text-base-geist",
      "lg-geist": "text-lg-geist",
      "xl-geist": "text-xl-geist",
      "2xl-geist": "text-2xl-geist",
      "3xl-geist": "text-3xl-geist",
      "4xl-geist": "text-4xl-geist",
      "5xl-geist": "text-5xl-geist",
      "6xl-geist": "text-6xl-geist",
      "7xl-geist": "text-7xl-geist",
      "8xl-geist": "text-8xl-geist",
      "9xl-geist": "text-9xl-geist",
      "10xl-geist": "text-10xl-geist",

      // SF Pro Display specific sizes
      "xs-sfpro": "text-xs-sfpro",
      "sm-sfpro": "text-sm-sfpro",
      "base-sfpro": "text-base-sfpro",
      "lg-sfpro": "text-lg-sfpro",
      "xl-sfpro": "text-xl-sfpro",
      "2xl-sfpro": "text-2xl-sfpro",
      "3xl-sfpro": "text-3xl-sfpro",
      "4xl-sfpro": "text-4xl-sfpro",
      "5xl-sfpro": "text-5xl-sfpro",
      "6xl-sfpro": "text-6xl-sfpro",
      "7xl-sfpro": "text-7xl-sfpro",
      "8xl-sfpro": "text-8xl-sfpro",
      "9xl-sfpro": "text-9xl-sfpro",
      "10xl-sfpro": "text-10xl-sfpro",
    },
  },
  defaultVariants: {
    variant: "p",
    weight: "normal",
    align: "left",
    color: "foreground",
    font: "darkerGrotesk",
    size: "base",
    gradient: false,
  },
  compoundVariants: [
    // PP Neue Montreal variants with size adjustments
    {
      font: "ppNeue",
      class: ({ size }: { size?: string }) => {
        if (!size) return "";
        return size.includes("ppneue") ? size : `text-${size}-ppneue`;
      },
    },
    // PP Neue Montreal variants
    {
      font: "ppNeue",
      variant: "h1",
      class: "font-bold",
    },
    {
      font: "ppNeue",
      variant: "h2",
      class: "font-semibold",
    },
    {
      font: "ppNeue",
      variant: "h3",
      class: "font-semibold",
    },
    // Darker Grotesk variants with size adjustments
    {
      font: "darkerGrotesk",
      class: ({ size }: { size?: string }) => {
        if (!size) return "";
        return size.includes("darker") ? size : `text-${size}-darker`;
      },
    },
    // Lab Grotesk variants with size adjustments
    {
      font: "labGrotesk",
      class: ({ size }: { size?: string }) => {
        if (!size) return "";
        return size.includes("lab") ? size : `text-${size}-lab`;
      },
    },
    // Geist Mono variants with size adjustments
    {
      font: "geistMono",
      class: ({ size }: { size?: string }) => {
        if (!size) return "";
        return size.includes("geist") ? size : `text-${size}-geist`;
      },
    },
    // Darker Grotesk variants
    {
      font: "darkerGrotesk",
      variant: "h1",
      class: "font-bold",
    },
    {
      font: "darkerGrotesk",
      variant: "h2",
      class: "font-semibold",
    },
    {
      font: "darkerGrotesk",
      variant: "h3",
      class: "font-semibold",
    },
    // Lab Grotesk variants
    {
      font: "labGrotesk",
      variant: "h1",
      class: "font-bold",
    },
    {
      font: "labGrotesk",
      variant: "h2",
      class: "font-semibold",
    },
    {
      font: "labGrotesk",
      variant: "h3",
      class: "font-semibold",
    },
    // Geist Mono variants
    {
      font: "geistMono",
      variant: "h1",
      class: "font-bold",
    },
    {
      font: "geistMono",
      variant: "h2",
      class: "font-semibold",
    },
    {
      font: "geistMono",
      variant: "h3",
      class: "font-semibold",
    },
    // SF Pro Display variants with size adjustments
    {
      font: "sfPro",
      class: ({ size }: { size?: string }) => {
        if (!size) return "";
        return size.includes("sfpro") ? size : `text-${size}-sfpro`;
      },
    },
    // SF Pro Display variants
    {
      font: "sfPro",
      variant: "h1",
      class: "font-bold",
    },
    {
      font: "sfPro",
      variant: "h2",
      class: "font-semibold",
    },
    {
      font: "sfPro",
      variant: "h3",
      class: "font-semibold",
    },
  ],
});

interface TypographyProps<C extends React.ElementType>
  extends VariantProps<typeof typographyVariants> {
  as?: C;
  children: React.ReactNode;
  className?: string;
  props?: React.ComponentPropsWithoutRef<C>;
  color1?: string;
  color2?: string;
  direction?:
    | "to-t"
    | "to-tr"
    | "to-r"
    | "to-br"
    | "to-b"
    | "to-bl"
    | "to-l"
    | "to-tl";
  linear?: boolean;
}

export function Typography<C extends React.ElementType = "p">({
  className,
  variant,
  weight,
  align,
  color,
  size,
  font,
  as,
  children,
  gradient = false,
  linear = false,
  color1 = "rgba(255,255,255,0.5)",
  color2 = "rgba(255,255,255,1)",
  direction = "to-b",
  ...props
}: TypographyProps<C>) {
  const Component =
    as || (variant as React.ElementType) || ("p" as React.ElementType);

  const combinedClassName = cn(
    typographyVariants({ variant, weight, align, color, size, font, gradient }),
    linear
      ? `bg-gradient-${direction} from-[${color1}] to-[${color2}] bg-clip-text text-transparent`
      : "",
    className,
  );

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}
