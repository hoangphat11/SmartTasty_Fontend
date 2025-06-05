import Link from "next/link";

import {
    EnvironmentOutlined, PhoneOutlined,
    FacebookFilled, MailOutlined,
} from "@ant-design/icons";

import { SiTiktok } from "react-icons/si";

import styles from "@/components/Footer/styles.module.scss"

const Footer = () => {
    return (
        <div className={styles.container}>
            <div className={styles.yard}>
                <div className={styles.areaLeft}>
                    <div className={styles.blockTitle}>
                        <span>Liên Hệ Với Chúng Tôi</span>
                           <hr />
                    </div>
                 
                    <div className={styles.blockAddress}>
                        <Link href="" className={styles.linkAddress}>
                            <span><EnvironmentOutlined style={{ marginRight: "10px" }} />Địa Chi Các Chỉ Nhánh</span>
                        </Link>
                    </div>

                     <div className={styles.blockEmail}>
                        <Link href="" className={styles.linkEmail}>
                            <span><MailOutlined style={{ marginRight: "10px" }} />admin@gmail.com</span>
                        </Link>
                    </div>

                    <div className={styles.blockPhone}>
                        <Link href="" className={styles.linkPhone}>
                            <span><PhoneOutlined style={{ marginRight: "10px" }} />0987654321</span>
                        </Link>
                    </div>
                </div>
                <div className={styles.areaBetween}>
                    <div className={styles.blockTitle}>
                        <span>Về Chúng Tôi</span>
                        <hr />
                    </div>
                    <div className={styles.blockContent}>
                        <span>
                            Đội ngủ vận hành
                        </span>
                    </div>
                  
                </div>
                <div className={styles.blockContact}>
                    <div className={styles.blockTitle}>
                        <span>Theo dõi qua</span>
                        <hr />
                    </div>
                  <div className={styles.blockFacebook}>
                        <Link href="" className={styles.linkFacebook}>
                            <FacebookFilled style={{ fontSize: "30px", color: "#1877F2" }} />
                        </Link>
                        <Link href="" className={styles.linkTiktok}>
                            <SiTiktok style={{ fontSize: "30px", color: "white" }} />
                        </Link>
                    </div>
                </div>
                <div className={styles.areaRight}>
                    <div className={styles.blockTitle}>
                        <span>Giờ Mở Cửa</span>
                        <hr />
                    </div>
                    <div className={styles.blockContent}>
                        <span>
                            Hằng Ngày<br />
                            07:00 Am - 23:00 Pm
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Footer;