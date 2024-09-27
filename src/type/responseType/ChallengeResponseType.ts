export interface ChallengeResponseType {
    roomId?: number,
    title?: string,
    description?: string,
    goalMoney?: number,
    imageUrl?: string,
    category?: "DIGITAL" | "TRAVEL" | "FASHION" | "TOYS" | "INTERIOR" | "ETC"
    memberLimit?: number,
    roomType?: string
    productImageUrl?: string
    productId?: number
}