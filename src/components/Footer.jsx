import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOOTER_LINKS = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "Catalogue", href: "#catalogue" },
    { label: "Measurements", href: "#measurements" },
    { label: "Contact", href: "#contact" },
  ],
  Company: [
    { label: "About Don Elclasico", href: "#about" },
    { label: "Our Story", href: "#story" },
    { label: "The Atelier", href: "#atelier" },
    { label: "Care Guide", href: "#care" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Use", href: "#terms" },
    { label: "Shipping & Returns", href: "#shipping" },
    { label: "Admin", href: "/admin" },
  ],
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/Don_elclasico",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/Don_elclasico", // TODO: confirm actual handle
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" />
        <line x1="19.5" y1="4.5" x2="4.5" y2="19.5" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2348068161932",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.548 4.1 1.508 5.83L0 24l6.335-1.647A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.823 9.823 0 01-5.006-1.366l-.36-.214-3.73.97.997-3.63-.235-.374A9.812 9.812 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@Don_elclasico", // TODO: confirm actual handle
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="5.5" width="20" height="13" rx="4" ry="4" />
        <polygon points="10,9.5 16,12 10,14.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:ibrahimayodeji188@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

const MODAL_CONTENT = {
  "About Don Elclasico": {
    sub: "Tailoring with intent.",
    heading: "About Don Elclasico",
    body: `Don Elclasico is a Lagos-based menswear atelier built around one idea: a garment should hold itself the way its owner does — structured, deliberate, unmistakable.\n\nWe work across bespoke commissions and limited ready-to-wear drops, with every piece cut, fitted, and finished in-house. No outsourced labour, no shortcuts on the things that actually show — the break of a sleeve, the roll of a lapel, the way a seam sits flat after a hundred wears.`,
    items: [
      "Bespoke commissions & made-to-measure",
      "In-house pattern cutting & tailoring",
      "Premium imported & local fabrics",
      "Atelier based in Lagos, Nigeria",
      "Personal styling consultations",
      "Limited ready-to-wear drops",
    ],
  },
  "Our Story": {
    sub: "Built on a standard, not a trend.",
    heading: "Our Story",
    body: `Don Elclasico started small — a single cutting table and a reputation built one well-fitted shoulder at a time. There was no marketing budget in the early days, only word of mouth from men who noticed the difference a properly cut jacket makes.\n\nThat reputation is still the foundation. As the atelier has grown, the standard hasn't moved: every commission gets the same attention the first one did, whether it's a single shirt or a full wardrobe.`,
    items: [
      "Founded by a master tailor",
      "Rooted in Lagos craftsmanship",
      "Built on word-of-mouth trust",
      "Every piece cut to the individual",
      "Years of combined tailoring experience",
      "Now dressing clients across Nigeria & the diaspora",
    ],
  },
  "The Atelier": {
    sub: "Where the work happens.",
    heading: "The Atelier",
    body: `Every commission moves through the same disciplined process: measurements taken with precision, a pattern cut by hand, a first fitting to catch what only a body in the garment can reveal, and a final finish that's checked seam by seam before it leaves the workshop.\n\nNothing ships until it's right. That's the whole philosophy, really — there isn't a faster version of this that we're willing to offer.`,
    items: [
      "Measurements taken in person or remotely",
      "Hand-cut patterns, no shortcuts",
      "Multiple fitting sessions on bespoke pieces",
      "Hand-finished seams & buttonholes",
      "Quality control on every commission",
      "Average turnaround: 3–4 weeks",
    ],
  },
  "Care Guide": {
    sub: "Keep it sharp.",
    heading: "Care Guide",
    body: `A well-made garment rewards a little discipline. Tailored pieces are built to last years, not seasons — but only if they're treated like it.\n\nFollow these basics and your pieces will hold their shape, their colour, and their structure far longer than anything off a rack.`,
    items: [
      "Dry clean tailored pieces only",
      "Steam — avoid ironing directly on fabric",
      "Store on proper shaped hangers",
      "Rotate wear to extend garment life",
      "Address loose threads immediately",
      "Professional pressing every 3–4 wears",
    ],
  },
  "Privacy Policy": {
    sub: "Your data. Handled with care.",
    heading: "Privacy Policy",
    body: `Last updated: June 2026\n\nDon Elclasico ("we", "us", "our") collects only the information needed to process commissions, measurements, and orders — name, contact details, and the body measurements you submit for fitting purposes.\n\nWe do not sell or share your data with third parties. Measurement records are stored securely and used solely to fulfil your order. You can request deletion of your data at any time by contacting us directly.`,
    items: [
      "No data sold to third parties",
      "Measurements stored securely & privately",
      "Used only for order & commission processing",
      "Email communications are opt-in",
      "Data deletion available on request",
      "Contact: ibrahimayodeji188@gmail.com",
    ],
  },
  "Terms of Use": {
    sub: "Clear terms. No surprises.",
    heading: "Terms of Use",
    body: `Last updated: June 2026\n\nBy using this site or commissioning a piece from Don Elclasico, you agree to these terms. Bespoke commissions are made to the measurements and specifications provided by the client at the time of order.\n\nAll content on this site — including photography, copy, and design — is the property of Don Elclasico and may not be reproduced without permission. Production timelines are estimates and may vary based on fabric availability and order volume.`,
    items: [
      "Bespoke pieces are made to submitted measurements",
      "All content © Don Elclasico",
      "No reproduction without permission",
      "Timelines are estimates, not guarantees",
      "Disputes resolved via direct contact",
      "Nigerian law governs these terms",
    ],
  },
  "Shipping & Returns": {
    sub: "What to expect after you order.",
    heading: "Shipping & Returns",
    body: `Bespoke and made-to-measure commissions are cut specifically to your measurements and are non-returnable once production has started, except in the case of a confirmed fitting or workmanship error.\n\nReady-to-wear pieces can be returned unworn, with tags attached, within 7 days of delivery. Lagos deliveries typically arrive within 2–4 business days; nationwide and international shipping timelines are confirmed at checkout.`,
    items: [
      "Bespoke orders are non-returnable once cut",
      "Ready-to-wear: 7-day return window, unworn",
      "Fitting or workmanship issues resolved free of charge",
      "Lagos delivery: 2–4 business days",
      "Nationwide & international shipping available",
      "Tracking sent once your order ships",
    ],
  },
};

function BrandMark({ size = "h-7 w-7", text = "text-sm" }) {
  return (
    <div className={`flex items-center gap-2.5 ${text}`} style={{ color: "var(--white)" }}>
      <svg
        className={`${size} shrink-0`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1080 1080"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M 745.837,613.206 L 745.837,627.847 L 744.976,640.766 L 744.115,650.239 L 743.254,658.852 L 742.392,665.742 L 741.531,672.632 L 740.670,678.660 L 739.809,684.689 L 738.947,689.856 L 737.225,699.330 L 734.641,712.249 L 732.919,720.000 L 729.474,733.780 L 726.890,743.254 L 724.306,751.866 L 718.278,769.952 L 715.694,776.842 L 710.526,789.761 L 707.943,795.789 L 702.775,806.986 L 701.053,810.431 L 698.469,815.598 L 695.024,821.627 L 691.579,827.656 L 688.995,831.962 L 682.105,842.297 L 677.799,848.325 L 671.770,856.077 L 665.742,862.967 L 651.100,877.608 L 645.072,882.775 L 641.627,885.359 L 638.182,887.943 L 630.431,893.110 L 626.124,895.694 L 621.818,898.278 L 618.373,900.000 L 613.206,902.584 L 605.455,906.029 L 598.565,908.612 L 595.981,909.474 L 593.397,910.335 L 584.785,912.919 L 581.340,913.780 L 577.895,914.641 L 573.589,915.502 L 569.282,916.364 L 564.115,917.225 L 558.947,918.086 L 551.196,918.947 L 540.861,919.809 L 528.804,919.809 L 522.775,918.947 L 518.469,918.086 L 515.885,917.225 L 513.301,916.364 L 508.134,913.780 L 505.550,912.057 L 502.967,910.335 L 496.077,903.445 L 494.354,900.861 L 492.632,898.278 L 490.048,893.110 L 487.464,885.359 L 486.603,881.053 L 485.742,874.163 L 485.742,816.459 L 348.804,817.321 L 348.804,873.301 L 347.943,879.330 L 347.081,882.775 L 346.220,886.220 L 345.359,888.804 L 344.498,891.388 L 341.914,896.555 L 340.191,899.139 L 338.469,901.722 L 330.718,909.474 L 328.134,911.196 L 323.828,913.780 L 322.105,914.641 L 317.799,916.364 L 315.215,917.225 L 311.770,918.086 L 308.325,918.947 L 304.019,919.809 L 298.852,920.670 L 291.100,921.531 L 277.321,922.392 L 257.512,922.392 L 255.789,924.115 L 256.651,970.622 L 617.512,970.622 L 627.847,969.761 L 634.737,968.900 L 639.904,968.038 L 644.211,967.177 L 648.517,966.316 L 658.852,963.732 L 667.464,961.148 L 670.048,960.287 L 679.522,956.842 L 685.550,954.258 L 691.579,951.675 L 703.636,945.646 L 713.971,939.617 L 720.861,935.311 L 723.445,932.727 L 726.029,931.866 L 728.612,930.144 L 738.947,922.392 L 743.254,918.947 L 754.450,909.474 L 780.287,883.636 L 786.316,876.746 L 796.651,863.828 L 800.096,859.522 L 806.986,850.048 L 813.014,841.435 L 814.737,838.852 L 822.488,826.794 L 826.794,819.904 L 830.239,813.876 L 833.684,807.847 L 840.574,794.928 L 843.158,789.761 L 850.909,773.397 L 854.354,765.646 L 856.077,761.340 L 857.799,757.033 L 862.105,745.837 L 864.689,738.947 L 870.718,720.861 L 873.301,712.249 L 875.024,706.220 L 876.746,700.191 L 879.330,689.856 L 881.914,678.660 L 882.775,674.354 L 885.359,658.852 L 886.220,652.823 L 887.081,646.794 L 887.943,638.182 L 888.804,629.569 L 888.804,612.344 Z M 254.067,110.239 L 254.067,154.163 L 255.789,155.885 L 278.182,155.885 L 289.378,156.746 L 296.268,157.608 L 301.435,158.469 L 304.880,159.330 L 308.325,160.191 L 310.909,161.053 L 316.938,163.636 L 318.660,164.498 L 322.967,167.081 L 326.411,169.665 L 333.301,176.555 L 336.746,180.861 L 338.469,183.445 L 339.330,185.167 L 341.914,191.196 L 342.775,193.780 L 343.636,196.364 L 344.498,200.670 L 345.359,205.837 L 346.220,219.617 L 346.220,303.158 L 344.498,306.603 L 84.402,306.603 L 82.679,308.325 L 82.679,348.804 L 84.402,350.526 L 95.598,350.526 L 103.349,351.388 L 108.517,352.249 L 112.823,353.110 L 115.407,353.971 L 119.713,355.694 L 123.158,357.416 L 128.325,360.000 L 130.909,361.722 L 139.522,370.335 L 142.105,373.780 L 145.550,380.670 L 148.134,388.421 L 148.995,391.866 L 149.856,396.172 L 150.718,403.062 L 150.718,690.718 L 149.856,696.746 L 148.995,700.191 L 148.134,703.636 L 147.273,706.220 L 145.550,710.526 L 144.689,712.249 L 143.828,713.971 L 142.105,716.555 L 140.383,719.139 L 136.938,723.445 L 135.215,725.167 L 130.909,728.612 L 128.325,730.335 L 125.742,732.057 L 124.019,732.919 L 119.713,734.641 L 117.129,735.502 L 114.545,736.364 L 111.100,737.225 L 105.933,738.086 L 99.904,738.947 L 85.263,738.947 L 83.541,739.809 L 83.541,779.426 L 674.354,779.426 L 676.077,777.703 L 676.938,775.120 L 678.660,770.813 L 681.244,763.062 L 685.550,750.144 L 688.134,740.670 L 688.995,737.225 L 689.856,732.919 L 688.995,730.335 L 486.603,729.474 L 486.603,404.785 L 349.665,404.785 L 348.804,730.335 L 309.187,731.196 L 288.517,731.196 L 279.043,730.335 L 275.598,729.474 L 270.431,726.890 L 266.986,723.445 L 266.124,723.445 L 263.541,720.861 L 260.957,717.416 L 259.234,713.971 L 256.651,708.804 L 255.789,706.220 L 254.928,703.636 L 254.067,699.330 L 253.206,693.301 L 252.344,681.244 L 253.206,565.837 L 309.187,565.837 L 309.187,519.330 L 254.067,519.330 L 252.344,517.608 L 252.344,360.861 L 254.067,359.139 L 686.411,359.139 L 685.550,306.603 L 485.742,305.742 L 485.742,192.919 L 486.603,188.612 L 487.464,184.306 L 490.909,177.416 L 493.493,173.971 L 496.077,171.388 L 499.522,168.804 L 504.689,166.220 L 507.273,165.359 L 510.718,164.498 L 589.091,164.498 L 595.981,165.359 L 601.148,166.220 L 611.483,168.804 L 621.818,172.249 L 626.124,173.971 L 637.321,179.139 L 641.627,181.722 L 650.239,186.890 L 656.268,191.196 L 659.713,193.780 L 664.880,198.086 L 673.493,205.837 L 679.522,211.866 L 679.522,212.727 L 686.411,219.617 L 690.718,224.785 L 698.469,235.120 L 703.636,242.871 L 707.943,249.761 L 710.526,254.067 L 714.833,261.818 L 717.416,266.986 L 721.722,275.598 L 726.029,285.072 L 728.612,291.100 L 730.335,295.407 L 732.057,299.713 L 734.641,306.603 L 738.947,318.660 L 742.392,329.856 L 747.560,347.943 L 748.421,351.388 L 751.005,362.584 L 752.727,370.335 L 753.589,374.641 L 756.172,390.144 L 757.033,396.172 L 757.895,402.201 L 758.756,409.091 L 759.617,416.842 L 760.478,427.177 L 761.340,440.957 L 761.340,484.019 L 760.478,498.660 L 759.617,508.995 L 758.756,515.885 L 757.033,517.608 L 522.775,518.469 L 522.775,521.914 L 523.636,522.775 L 523.636,526.220 L 522.775,543.445 L 523.636,567.560 L 567.560,567.560 L 568.421,568.421 L 702.775,569.282 L 846.603,569.282 L 890.526,570.144 L 896.555,571.005 L 900.000,571.866 L 906.029,573.589 L 910.335,575.311 L 915.502,577.895 L 918.086,579.617 L 920.670,581.340 L 924.976,584.785 L 930.144,589.952 L 932.727,593.397 L 934.450,595.981 L 937.895,602.010 L 939.617,606.316 L 940.478,608.900 L 941.340,611.483 L 942.201,614.928 L 943.062,618.373 L 943.923,623.541 L 944.785,633.876 L 943.923,650.239 L 943.923,663.158 L 996.459,663.158 L 995.598,432.344 L 943.923,433.206 L 943.923,439.234 L 944.785,454.737 L 943.923,465.933 L 943.062,471.100 L 942.201,474.545 L 941.340,477.990 L 940.478,480.574 L 939.617,483.158 L 937.895,486.603 L 935.311,491.770 L 933.589,494.354 L 931.005,497.799 L 923.254,505.550 L 915.502,510.718 L 913.780,511.579 L 912.057,512.440 L 904.306,515.024 L 900.861,515.885 L 896.555,515.024 L 896.555,453.876 L 895.694,440.096 L 894.833,429.761 L 893.971,422.010 L 893.110,414.258 L 892.249,407.368 L 891.388,401.340 L 889.665,390.144 L 887.943,380.670 L 884.498,363.445 L 881.914,352.249 L 881.053,348.804 L 878.469,339.330 L 876.746,333.301 L 870.718,315.215 L 867.273,305.742 L 861.244,291.100 L 856.077,279.904 L 853.493,274.737 L 849.187,266.124 L 844.880,258.373 L 841.435,252.344 L 838.852,248.038 L 834.545,241.148 L 831.100,235.981 L 825.933,228.230 L 821.627,222.201 L 813.876,211.866 L 810.431,207.560 L 806.124,202.392 L 800.957,196.364 L 776.842,172.249 L 770.813,167.081 L 766.507,163.636 L 762.201,160.191 L 751.866,152.440 L 741.531,145.550 L 734.641,141.244 L 728.612,137.799 L 721.722,134.354 L 709.665,128.325 L 701.914,124.880 L 695.024,122.297 L 689.856,120.574 L 682.105,117.990 L 676.077,116.268 L 662.297,112.823 L 652.823,111.100 L 646.794,110.239 L 638.182,109.378 Z"
        />
      </svg>
      <span className="font-bold tracking-[0.32em]" style={{ fontFamily: "var(--font-display)" }}>
        DON ELCLASICO
      </span>
    </div>
  );
}

function FooterModal({ id, onClose }) {
  const content = MODAL_CONTENT[id];
  if (!content) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="relative max-h-[88vh] w-full max-w-[720px] overflow-y-auto border [&::-webkit-scrollbar]:hidden"
          style={{ background: "var(--dark)", borderColor: "var(--border)", scrollbarWidth: "none" }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header row: logo top-left, close top-right */}
          <div className="sticky top-0 z-[1] flex items-center justify-between px-8 pt-6 pb-2" style={{ background: "var(--dark)" }}>
            <BrandMark size="h-6 w-6" text="text-[0.78rem]" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[1.1rem] transition-colors duration-200 hover:text-[var(--white)]"
              style={{ color: "var(--text-muted)" }}
            >
              ✕
            </button>
          </div>

          <div className="px-10 pb-12 pt-4">
            <p
              className="mb-4 text-[0.7rem] uppercase tracking-[0.22em]"
              style={{ color: "var(--accent)" }}
            >
              {content.sub}
            </p>
            <h2
              className="mb-6 text-[clamp(2.2rem,5vw,3.2rem)] font-light leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", color: "var(--white)" }}
            >
              {content.heading}
            </h2>
            <div
              className="mb-8 h-px"
              style={{ background: "linear-gradient(to right, var(--accent), transparent)" }}
            />

            <div className="mb-8">
              {content.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="mb-5 text-[0.92rem] leading-[1.8]"
                  style={{ color: "var(--text-light)" }}
                >
                  {para}
                </p>
              ))}
            </div>

            {content.items && (
              <ul className="mb-2 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {content.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-2.5 text-[0.85rem]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="text-[0.45rem]" style={{ color: "var(--accent)" }}>
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const MODAL_KEYS = new Set(Object.keys(MODAL_CONTENT));

export default function Footer() {
  const year = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const handleNavClick = (e, href) => {
    if (!href.startsWith("#") || MODAL_KEYS.has(href)) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="border-t px-[clamp(1.5rem,6vw,7rem)] pb-12 pt-24"
      style={{ borderColor: "var(--border-light)", background: "var(--off-black)" }}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Top: brand + nav columns */}
        <div className="mb-20 grid grid-cols-1 gap-16 md:grid-cols-[1fr_1.6fr] md:gap-24">
          {/* Brand */}
          <div className="flex flex-col gap-7">
            <BrandMark size="h-12 w-12" text="text-2xl" />

            <p
              className="max-w-[300px] text-[0.95rem] font-light leading-[1.8]"
              style={{ color: "var(--text-light)" }}
            >
              Where every seam carries your signature.
            </p>

            <div className="mt-1 flex flex-wrap gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noopener noreferrer" : undefined}
                  className="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:text-[var(--accent)] hover:border-[var(--accent)]"
                  style={{ color: "var(--text-muted)", borderColor: "var(--border-light)" }}
                >
                  <span className="h-5 w-5">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-12" aria-label="Footer navigation">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div
                key={group}
                className={
                  group === "Legal"
                    ? "col-span-2 grid grid-cols-2 gap-x-10 gap-y-4 border-t pt-8 sm:col-span-1 sm:block sm:border-t-0 sm:pt-0"
                    : undefined
                }
                style={group === "Legal" ? { borderColor: "var(--border-light)" } : undefined}
              >
                <h3
                  className={
                    group === "Legal"
                      ? "col-span-2 mb-7 text-[0.72rem] font-medium uppercase tracking-[0.2em] sm:col-span-1"
                      : "mb-7 text-[0.72rem] font-medium uppercase tracking-[0.2em]"
                  }
                  style={{ color: "var(--accent)" }}
                >
                  {group}
                </h3>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      {MODAL_KEYS.has(link.label) ? (
                        <button
                          onClick={() => setActiveModal(link.label)}
                          className="text-left text-[0.88rem] font-light transition-colors duration-300 hover:text-[var(--white)]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="text-[0.88rem] font-light transition-colors duration-300 hover:text-[var(--white)]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          className="mb-11 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
          }}
        />

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8rem] font-light" style={{ color: "var(--text-muted)" }}>
            © {year} DON ELCLASICO. All rights reserved.
          </p>
          <p className="text-[0.8rem] font-light" style={{ color: "var(--text-muted)" }}>
            Engineered with precision in Nigeria.
          </p>
        </div>
      </div>

      {activeModal && <FooterModal id={activeModal} onClose={() => setActiveModal(null)} />}
    </footer>
  );
}
