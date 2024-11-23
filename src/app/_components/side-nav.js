// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { NAVIGATION } from '../_constants/nav-bar';

// export default function SideNav() {
//   const router = useRouter();

//   return (
//     <div style={{ width: '250px', background: '#f4f4f4' }}>
//       <nav>
//         {NAVIGATION.map((item, index) => {
//           if (item.kind === 'header') {
//             return (
//               <div key={index} style={{ fontWeight: 'bold', margin: '10px 0' }}>
//                 {item.title}
//               </div>
//             );
//           }
//           if (item.kind === 'divider') {
//             return <hr key={index} />;
//           }
//           return (
//             <Link
//               key={index}
//               href={`/${item.pattern}`}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '10px',
//                 textDecoration: 'none',
//                 backgroundColor: router.pathname.includes(item.pattern) ? '#ddd' : 'transparent',
//                 color: router.pathname.includes(item.pattern) ? '#000' : '#555',
//               }}
//             >
//               {item.icon}
//               <span style={{ marginLeft: '10px' }}>{item.title}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NAVIGATION } from '../_constants/nav-bar';

export default function SideNav() {
  const pathname = usePathname(); // Get the current path

  return (
    <div style={{ width: '250px', background: '#f4f4f4' }}>
      <nav>
        {NAVIGATION.map((item, index) => {
          if (item.kind === 'header') {
            return (
              <div key={index} style={{ fontWeight: 'bold', margin: '10px 0' }}>
                {item.title}
              </div>
            );
          }
          if (item.kind === 'divider') {
            return <hr key={index} />;
          }
          return (
            <Link
              key={index}
              href={`/${item.pattern}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                textDecoration: 'none',
                backgroundColor: pathname?.includes(item.pattern) ? '#ddd' : 'transparent',
                color: pathname?.includes(item.pattern) ? '#000' : '#555',
              }}
            >
              {item.icon}
              <span style={{ marginLeft: '10px' }}>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
